import { test, expect } from '@playwright/test';

const URL  = 'https://localhost:5173';
const API  = 'https://localhost:3443';

// Helper: login API direct și obține JWT
async function apiLogin(request, email, password) {
  const res = await request.post(`${API}/api/auth/login`, {
    data: { email, password },
    ignoreHTTPSErrors: true,
  });
  const body = await res.json();
  return body.token;
}

// ─── SIMULARE BOT 1: Brute Force Login ───────────────────────────────────────
test.describe('Bot Simulation 1: Brute Force Login', () => {
  test('detectie brute force — 6 incercari esuate consecutiv', async ({ request }) => {
    const attempts = 6;
    let lastStatus = 0;

    for (let i = 0; i < attempts; i++) {
      const res = await request.post(`${API}/api/auth/login`, {
        data: { email: 'demo@petvet.ro', password: `gresit${i}` },
        ignoreHTTPSErrors: true,
      });
      lastStatus = res.status();
    }

    // Toate încearcările esuează cu 401
    expect(lastStatus).toBe(401);

    // Verifică că utilizatorul a fost flagat ca suspicious
    const adminToken = await apiLogin(request, 'admin@petvet.ro', 'admin123');
    const suspRes = await request.get(`${API}/api/admin/suspicious`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      ignoreHTTPSErrors: true,
    });
    expect(suspRes.status()).toBe(200);
    const suspicious = await suspRes.json();
    const flagged = suspicious.find(s => s.user.email === 'demo@petvet.ro');
    expect(flagged).toBeTruthy();
    console.log('Brute force detectat:', flagged?.reason);
  });
});

// ─── SIMULARE BOT 2: Rate Limit (DDoS light) ─────────────────────────────────
test.describe('Bot Simulation 2: Rate Limit', () => {
  test('cereri rapide sunt blocate dupa pragul de rate limit', async ({ request }) => {
    const token = await apiLogin(request, 'demo@petvet.ro', 'demo123');
    const REQUESTS = 70; // peste limita de 60/min
    const results = [];

    for (let i = 0; i < REQUESTS; i++) {
      const res = await request.get(`${API}/api/stats`, {
        headers: { Authorization: `Bearer ${token}` },
        ignoreHTTPSErrors: true,
      });
      results.push(res.status());
    }

    const blocked = results.filter(s => s === 429).length;
    const ok      = results.filter(s => s === 200).length;
    console.log(`Rate limit test: ${ok} OK, ${blocked} blocate (429)`);
    expect(blocked).toBeGreaterThan(0);
  });
});

// ─── SIMULARE BOT 3: Mass Creation (spam animale) ────────────────────────────
test.describe('Bot Simulation 3: Mass Resource Creation', () => {
  test('creare masiva de animale triggereaza detectia AI', async ({ request }) => {
    const token = await apiLogin(request, 'demo@petvet.ro', 'demo123');

    // Obține speciesId și statusId
    const refRes = await request.get(`${API}/api/ref/species`, {
      headers: { Authorization: `Bearer ${token}` },
      ignoreHTTPSErrors: true,
    });
    const species = await refRes.json();
    const speciesId = species[0]?.id || 1;

    // Obține userId
    const meRes = await request.get(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      ignoreHTTPSErrors: true,
    });
    const me = await meRes.json();

    // Creează 22 animale rapid (pragul e 20 în 5 minute)
    for (let i = 0; i < 22; i++) {
      await request.post(`${API}/api/pets`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        data: {
          name: `Bot-Pet-${i}`,
          speciesId,
          age: 1, weight: 5, gender: 'Mascul',
          ownerId: me.id,
          vaccinated: false,
        },
        ignoreHTTPSErrors: true,
      });
    }

    // Verifică că a fost detectat
    const adminToken = await apiLogin(request, 'admin@petvet.ro', 'admin123');
    const suspRes = await request.get(`${API}/api/admin/suspicious`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      ignoreHTTPSErrors: true,
    });
    const suspicious = await suspRes.json();
    const flagged = suspicious.find(s => s.user.id === me.id);
    console.log('Mass creation detectata:', flagged?.reason);
    expect(flagged).toBeTruthy();
  });
});

// ─── TEST GOLD: Performanta cache vs naive ────────────────────────────────────
test.describe('Gold: Performanta Cache vs Naive', () => {
  test('endpoint cached este semnificativ mai rapid la al 2-lea apel', async ({ request }) => {
    const token = await apiLogin(request, 'admin@petvet.ro', 'admin123');
    const headers = { Authorization: `Bearer ${token}` };

    // Prima cerere naive (fără cache)
    const t1 = Date.now();
    await request.get(`${API}/api/stats/services-by-species`, { headers, ignoreHTTPSErrors: true });
    const naiveMs = Date.now() - t1;

    // Prima cerere cached (prima oară va fi lentă)
    await request.get(`${API}/api/stats/services-by-species/cached`, { headers, ignoreHTTPSErrors: true });

    // A doua cerere cached (din cache — trebuie să fie < 10ms)
    const t2 = Date.now();
    const cachedRes = await request.get(`${API}/api/stats/services-by-species/cached`, { headers, ignoreHTTPSErrors: true });
    const cachedMs = Date.now() - t2;

    const body = await cachedRes.json();
    console.log(`Naive: ${naiveMs}ms | Cached (hit): ${cachedMs}ms | cached=${body.cached}`);
    expect(body.cached).toBe(true);
    expect(cachedMs).toBeLessThan(naiveMs);
  });
});
