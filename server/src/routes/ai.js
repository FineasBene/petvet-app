const router = require('express').Router();
const prisma  = require('../db');
const http    = require('http');
const { requireRole } = require('../middleware/auth');

router.use(requireRole('admin'));

const OLLAMA_HOST  = process.env.OLLAMA_HOST  || 'localhost';
const OLLAMA_PORT  = process.env.OLLAMA_PORT  || 11434;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'phi3';

// Trimite prompt la Ollama și returnează răspunsul complet
function askOllama(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: OLLAMA_MODEL,
      messages: [
        {
          role: 'system',
          content: `Ești un sistem de securitate AI pentru o aplicație veterinară (PetVet).
Analizezi log-uri de acțiuni ale utilizatorilor și identifici comportamente suspecte.
Răspunde DOAR în română, concis, fără formatare Markdown. Maximum 5 propoziții.
Dacă comportamentul e normal, spune explicit că nu există semne de activitate malițioasă.`,
        },
        { role: 'user', content: prompt },
      ],
      stream: false,
    });

    const req = http.request(
      { hostname: OLLAMA_HOST, port: OLLAMA_PORT, path: '/api/chat', method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } },
      res => {
        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => {
          try { resolve(JSON.parse(data).message?.content || 'Fără răspuns.'); }
          catch { resolve('Eroare la parsarea răspunsului Ollama.'); }
        });
      }
    );
    req.on('error', reject);
    req.setTimeout(30_000, () => { req.destroy(); reject(new Error('Timeout Ollama')); });
    req.write(body);
    req.end();
  });
}

// Verifică dacă Ollama rulează
function checkOllama() {
  return new Promise(resolve => {
    const req = http.request(
      { hostname: OLLAMA_HOST, port: OLLAMA_PORT, path: '/api/tags', method: 'GET' },
      res => { res.resume(); resolve(res.statusCode === 200); }
    );
    req.on('error', () => resolve(false));
    req.setTimeout(2000, () => { req.destroy(); resolve(false); });
    req.end();
  });
}

// GET /api/ai/status — verifică dacă Ollama e disponibil
router.get('/status', async (req, res) => {
  const running = await checkOllama();
  let models = [];
  if (running) {
    try {
      const data = await new Promise((resolve, reject) => {
        const r = http.request(
          { hostname: OLLAMA_HOST, port: OLLAMA_PORT, path: '/api/tags', method: 'GET' },
          resp => { let d = ''; resp.on('data', c => d += c); resp.on('end', () => resolve(JSON.parse(d))); }
        );
        r.on('error', reject); r.end();
      });
      models = (data.models || []).map(m => m.name);
    } catch {}
  }
  res.json({ running, model: OLLAMA_MODEL, models });
});

// POST /api/ai/analyze/:userId — analizează un utilizator specific
router.post('/analyze/:userId', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);

    const [user, logs, failedLogins, suspicious] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, include: { role: true } }),
      prisma.actionLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      prisma.failedLogin.findMany({
        where: { email: { not: '' } },
        orderBy: { attemptAt: 'desc' },
        take: 20,
      }),
      prisma.suspiciousUser.findUnique({ where: { userId } }),
    ]);

    if (!user) return res.status(404).json({ error: 'Utilizator negăsit' });

    // Construiește rezumatul pentru AI
    const actionCounts = {};
    for (const log of logs) {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
    }

    const lastHour  = logs.filter(l => l.createdAt > new Date(Date.now() - 3600_000));
    const last5Min  = logs.filter(l => l.createdAt > new Date(Date.now() - 300_000));
    const deletes   = logs.filter(l => l.action.startsWith('DELETE')).length;
    const creates   = logs.filter(l => l.action.startsWith('CREATE')).length;

    const prompt = `Analizează comportamentul acestui utilizator PetVet:

Utilizator: ${user.name} (${user.email}), rol: ${user.role.name}
Total acțiuni înregistrate: ${logs.length}
Acțiuni în ultima oră: ${lastHour.length}
Acțiuni în ultimele 5 minute: ${last5Min.length}
Distribuție acțiuni: ${JSON.stringify(actionCounts)}
Total ștergeri: ${deletes}
Total creări: ${creates}
${suspicious ? `DEJA MARCAT SUSPICIOS: ${suspicious.reason}` : 'Nu este marcat suspicios anterior.'}
Ultimele 10 acțiuni: ${logs.slice(0, 10).map(l => `[${new Date(l.createdAt).toLocaleTimeString('ro')}] ${l.action}`).join(', ')}

Există semne de comportament malițios sau automatizat? Explică de ce DA sau de ce NU.`;

    const running = await checkOllama();

    if (!running) {
      // Fallback: analiză bazată pe reguli cu explicație
      const issues = [];
      if (last5Min.length >= 20) issues.push(`activitate intensă: ${last5Min.length} acțiuni în 5 minute`);
      if (deletes >= 5) issues.push(`${deletes} ștergeri — posibilă ștergere în masă`);
      if (creates >= 20) issues.push(`${creates} creări — posibil bot de spam`);
      if (suspicious) issues.push(`marcat anterior: ${suspicious.reason}`);

      const analysis = issues.length > 0
        ? `SUSPICIOS. Motive detectate: ${issues.join('; ')}. Se recomandă investigare manuală.`
        : `Comportament normal. Nu s-au detectat anomalii semnificative pentru acest utilizator.`;

      return res.json({ analysis, source: 'rules', ollamaRunning: false });
    }

    const analysis = await askOllama(prompt);
    res.json({ analysis, source: 'ollama', model: OLLAMA_MODEL, ollamaRunning: true });
  } catch (err) {
    if (err.message === 'Timeout Ollama') {
      return res.status(504).json({ error: 'Ollama nu a răspuns în 30s. Încearcă un model mai mic.' });
    }
    next(err);
  }
});

// POST /api/ai/analyze-all — analizează toți utilizatorii suspicioși
router.post('/analyze-all', async (req, res, next) => {
  try {
    const suspicious = await prisma.suspiciousUser.findMany({
      where: { resolved: false },
      include: { user: { include: { role: true } } },
      take: 5, // max 5 pentru a nu supraîncărca Ollama
    });

    if (!suspicious.length) return res.json({ results: [], message: 'Nu există utilizatori suspicioși nerezolvați.' });

    const running = await checkOllama();
    const results = [];

    for (const s of suspicious) {
      const logs = await prisma.actionLog.findMany({
        where: { userId: s.userId },
        orderBy: { createdAt: 'desc' },
        take: 30,
      });

      const last5Min = logs.filter(l => l.createdAt > new Date(Date.now() - 300_000));
      const actionCounts = {};
      for (const l of logs) actionCounts[l.action] = (actionCounts[l.action] || 0) + 1;

      let analysis;
      if (running) {
        const prompt = `Utilizator suspicios în PetVet: ${s.user.name} (${s.user.role.name}).
Motiv flag: ${s.reason}
Acțiuni recente (ultimele 30): ${logs.map(l => l.action).join(', ')}
Acțiuni în 5 min: ${last5Min.length}
Distribuție: ${JSON.stringify(actionCounts)}
Este o amenințare reală? Scurt verdict.`;
        analysis = await askOllama(prompt).catch(() => `Eroare Ollama — motiv flagat: ${s.reason}`);
      } else {
        analysis = `Analiză locală (Ollama oprit): ${s.reason}`;
      }

      results.push({
        userId: s.userId,
        name: s.user.name,
        email: s.user.email,
        role: s.user.role.name,
        flagReason: s.reason,
        flaggedAt: s.flaggedAt,
        analysis,
        source: running ? 'ollama' : 'rules',
      });
    }

    res.json({ results, ollamaRunning: running, model: OLLAMA_MODEL });
  } catch (err) { next(err); }
});

module.exports = router;
