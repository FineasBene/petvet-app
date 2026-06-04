const request = require('supertest');
const app = require('../src/app');
const { prisma, seedTestDb, cleanTestDb } = require('./helpers');

beforeAll(async () => {
  const ctx = await seedTestDb();
  // Creează un pet și o programare pentru statistici
  const pet = await prisma.pet.create({
    data: { name: 'StatPet', speciesId: ctx.speciesMap['Câine'], age: 2, weight: 10, gender: 'Mascul', ownerId: ctx.user.id, vaccinated: true }
  });
  await prisma.appointment.create({
    data: { petId: pet.id, serviceId: ctx.svc1.id, date: new Date('2024-05-01'), time: '09:00', provider: 'X', location: 'Y', statusId: ctx.statusMap['Confirmată'] }
  });
});

afterAll(async () => {
  await cleanTestDb();
  await prisma.$disconnect();
});

test('GET /api/stats returnează statistici generale', async () => {
  const res = await request(app).get('/api/stats');
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('totalPets');
  expect(res.body).toHaveProperty('totalAppointments');
  expect(res.body).toHaveProperty('totalUsers');
  expect(res.body).toHaveProperty('vaccinatedPets');
  expect(res.body.totalPets).toBeGreaterThan(0);
});

test('GET /api/stats/pets-by-species returnează distribuție pe specii', async () => {
  const res = await request(app).get('/api/stats/pets-by-species');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body[0]).toHaveProperty('species');
  expect(res.body[0]).toHaveProperty('count');
});

test('GET /api/stats/appointments-by-status returnează distribuție pe status', async () => {
  const res = await request(app).get('/api/stats/appointments-by-status');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test('GET /api/stats/appointments-by-category returnează distribuție pe categorie', async () => {
  const res = await request(app).get('/api/stats/appointments-by-category');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test('GET /api/stats/vaccinated returnează status vaccinare', async () => {
  const res = await request(app).get('/api/stats/vaccinated');
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('vaccinated');
  expect(res.body).toHaveProperty('notVaccinated');
  expect(res.body.vaccinated).toBeGreaterThan(0);
});
