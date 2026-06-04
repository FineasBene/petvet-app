require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const now = () => new Date();
const ago = (ms) => new Date(Date.now() - ms);
const s = 1000, m = 60 * s, h = 60 * m;

async function main() {
  // Preia primii 3 useri de tip owner din DB (generati de faker)
  const owners = await prisma.user.findMany({
    where: { role: { name: 'owner' } },
    take: 3,
    skip: 5, // sari peste primii ca sa nu fie chiar admin/test
    include: { role: true },
  });

  if (owners.length < 3) {
    console.error('Nu s-au găsit suficienți utilizatori. Rulează mai întâi seed-faker.js');
    process.exit(1);
  }

  const [u1, u2, u3] = owners;
  console.log(`Utilizatori selectați: ${u1.name}, ${u2.name}, ${u3.name}`);

  // Curăță datele vechi pentru acești useri
  await prisma.actionLog.deleteMany({ where: { userId: { in: [u1.id, u2.id, u3.id] } } });
  await prisma.suspiciousUser.deleteMany({ where: { userId: { in: [u1.id, u2.id, u3.id] } } });
  await prisma.failedLogin.deleteMany({ where: { email: { in: [u1.email, u2.email, u3.email] } } });

  // ── USER 1: bot de creare în masă ─────────────────────────────────────────
  // 34 de acțiuni CREATE_PET în 4 minute → bot automat
  const u1Logs = [];
  for (let i = 0; i < 34; i++) {
    u1Logs.push({
      userId: u1.id,
      groupId: 'owner',
      action: 'CREATE_PET',
      details: { petName: `Bot_Animal_${i + 1}`, species: 'Câine' },
      ipAddress: '192.168.1.47',
      createdAt: ago(4 * m - i * 7 * s), // toate în ultimele 4 minute
    });
  }
  // + câteva CREATE_APPOINTMENT rapide
  for (let i = 0; i < 18; i++) {
    u1Logs.push({
      userId: u1.id,
      groupId: 'owner',
      action: 'CREATE_APPOINTMENT',
      details: { service: 'Consultație generală' },
      ipAddress: '192.168.1.47',
      createdAt: ago(3 * m - i * 9 * s),
    });
  }
  // + un login la început
  u1Logs.push({
    userId: u1.id, groupId: 'owner', action: 'LOGIN',
    details: { method: 'password' }, ipAddress: '192.168.1.47',
    createdAt: ago(5 * m),
  });

  await prisma.actionLog.createMany({ data: u1Logs });
  await prisma.suspiciousUser.create({
    data: {
      userId: u1.id,
      reason: `Activitate automată detectată: 34 acțiuni CREATE_PET și 18 CREATE_APPOINTMENT în mai puțin de 5 minute de la IP 192.168.1.47. Rată: ~10 acțiuni/minut — imposibil manual.`,
      flaggedAt: ago(1 * m),
    },
  });

  // ── USER 2: ștergere în masă ──────────────────────────────────────────────
  // 12 DELETE_PET + 8 DELETE_APPOINTMENT în 20 minute
  const u2Logs = [];
  u2Logs.push({
    userId: u2.id, groupId: 'owner', action: 'LOGIN',
    details: { method: 'password' }, ipAddress: '10.0.0.88',
    createdAt: ago(22 * m),
  });
  // activitate normală scurtă inițial
  for (let i = 0; i < 4; i++) {
    u2Logs.push({
      userId: u2.id, groupId: 'owner', action: 'VIEW_PETS',
      details: {}, ipAddress: '10.0.0.88',
      createdAt: ago(21 * m - i * 30 * s),
    });
  }
  // apoi explodează cu ștergeri
  for (let i = 0; i < 12; i++) {
    u2Logs.push({
      userId: u2.id, groupId: 'owner', action: 'DELETE_PET',
      details: { petId: 100 + i },
      ipAddress: '10.0.0.88',
      createdAt: ago(18 * m - i * 45 * s),
    });
  }
  for (let i = 0; i < 8; i++) {
    u2Logs.push({
      userId: u2.id, groupId: 'owner', action: 'DELETE_APPOINTMENT',
      details: { apptId: 200 + i },
      ipAddress: '10.0.0.88',
      createdAt: ago(12 * m - i * 50 * s),
    });
  }
  // tentative de acces la rute admin
  for (let i = 0; i < 5; i++) {
    u2Logs.push({
      userId: u2.id, groupId: 'owner', action: 'UNAUTHORIZED_ACCESS',
      details: { path: '/api/admin/users', method: 'GET' },
      ipAddress: '10.0.0.88',
      createdAt: ago(8 * m - i * 30 * s),
    });
  }

  await prisma.actionLog.createMany({ data: u2Logs });
  await prisma.suspiciousUser.create({
    data: {
      userId: u2.id,
      reason: `Ștergere masivă: 12 DELETE_PET + 8 DELETE_APPOINTMENT în 20 de minute. Plus 5 încercări de acces neautorizat la /api/admin din IP 10.0.0.88. Posibil cont compromis sau sabotaj intenționat.`,
      flaggedAt: ago(6 * m),
    },
  });

  // ── USER 3: brute-force login din mai multe IP-uri ────────────────────────
  // 23 de autentificări eșuate urmate de login reușit
  const bruteIPs = ['185.220.101.5', '185.220.101.6', '91.108.4.200', '194.165.16.11', '45.142.212.100'];
  for (let i = 0; i < 23; i++) {
    await prisma.failedLogin.create({
      data: {
        email: u3.email,
        ipAddress: bruteIPs[i % bruteIPs.length],
        attemptAt: ago(45 * m - i * 1.8 * m),
      },
    });
  }

  const u3Logs = [];
  // login reușit după atacul brute-force
  u3Logs.push({
    userId: u3.id, groupId: 'owner', action: 'LOGIN',
    details: { method: 'password', note: 'succes dupa 23 incercari esuate' },
    ipAddress: '185.220.101.5',
    createdAt: ago(20 * m),
  });
  // acțiuni rapide post-login — posibil scraper
  for (let i = 0; i < 11; i++) {
    u3Logs.push({
      userId: u3.id, groupId: 'owner', action: 'VIEW_PETS',
      details: { page: i + 1 },
      ipAddress: '185.220.101.5',
      createdAt: ago(19 * m - i * 15 * s),
    });
  }
  for (let i = 0; i < 7; i++) {
    u3Logs.push({
      userId: u3.id, groupId: 'owner', action: 'VIEW_APPOINTMENTS',
      details: {},
      ipAddress: '185.220.101.5',
      createdAt: ago(17 * m - i * 20 * s),
    });
  }
  // tentativă export date
  u3Logs.push({
    userId: u3.id, groupId: 'owner', action: 'EXPORT_DATA_ATTEMPT',
    details: { path: '/api/admin/users', blocked: true },
    ipAddress: '185.220.101.5',
    createdAt: ago(14 * m),
  });

  await prisma.actionLog.createMany({ data: u3Logs });
  await prisma.suspiciousUser.create({
    data: {
      userId: u3.id,
      reason: `Atac brute-force: 23 autentificări eșuate din 5 IP-uri diferite (rețea Tor/VPN), urmate de login reușit. Post-login: parcurgere rapidă a 11 pagini de animale + tentativă de acces la export date admin. IP principal: 185.220.101.5 (listat în blocklist Tor).`,
      flaggedAt: ago(12 * m),
    },
  });

  console.log('\nActivități suspicioase generate cu succes:');
  console.log(`  ${u1.name} (${u1.email}) — bot creare în masă (${u1Logs.length} acțiuni)`);
  console.log(`  ${u2.name} (${u2.email}) — ștergere masivă + acces neautorizat (${u2Logs.length} acțiuni)`);
  console.log(`  ${u3.name} (${u3.email}) — brute-force + scraping (${u3Logs.length} acțiuni + 23 failed logins)`);
  console.log('\nMergi la Admin → 🤖 AI Monitor → "Analizează toți suspicioșii"');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
