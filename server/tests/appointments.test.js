const request = require('supertest');
const app = require('../src/app');
const { prisma, seedTestDb, cleanTestDb } = require('./helpers');

let ctx;
let petId;
let createdApptId;

beforeAll(async () => {
  ctx = await seedTestDb();
  const pet = await prisma.pet.create({
    data: { name: 'TestPet', speciesId: ctx.speciesMap['Câine'], age: 1, weight: 5, gender: 'Mascul', ownerId: ctx.user.id }
  });
  petId = pet.id;
});

afterAll(async () => {
  await cleanTestDb();
  await prisma.$disconnect();
});

const validAppt = () => ({
  petId,
  serviceId: ctx.svc1.id,
  date: '2024-06-15',
  time: '10:00',
  provider: 'Dr. Test',
  location: 'Clinica Test',
  statusId: ctx.statusMap['Confirmată']
});

describe('POST /api/appointments', () => {
  test('creează o programare validă', async () => {
    const res = await request(app).post('/api/appointments').send(validAppt());
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ time: '10:00', provider: 'Dr. Test' });
    expect(res.body.status.name).toBe('Confirmată');
    createdApptId = res.body.id;
  });

  test('fără câmpuri obligatorii returnează 400', async () => {
    const res = await request(app).post('/api/appointments').send({ petId });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/appointments', () => {
  test('returnează lista de programări', async () => {
    const res = await request(app).get('/api/appointments');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('filtrare după petId', async () => {
    const res = await request(app).get(`/api/appointments?petId=${petId}`);
    expect(res.status).toBe(200);
    res.body.forEach(a => expect(a.pet.id).toBe(petId));
  });

  test('filtrare după statusId', async () => {
    const statusId = ctx.statusMap['Confirmată'];
    const res = await request(app).get(`/api/appointments?statusId=${statusId}`);
    expect(res.status).toBe(200);
    res.body.forEach(a => expect(a.status.name).toBe('Confirmată'));
  });

  test('filtrare după interval de date', async () => {
    const res = await request(app).get('/api/appointments?dateFrom=2024-01-01&dateTo=2024-12-31');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/appointments/:id', () => {
  test('returnează programarea corectă', async () => {
    const res = await request(app).get(`/api/appointments/${createdApptId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdApptId);
  });

  test('id inexistent returnează 404', async () => {
    const res = await request(app).get('/api/appointments/999999');
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/appointments/:id', () => {
  test('actualizează statusul programării', async () => {
    const res = await request(app).put(`/api/appointments/${createdApptId}`).send({
      statusId: ctx.statusMap['Finalizată']
    });
    expect(res.status).toBe(200);
    expect(res.body.status.name).toBe('Finalizată');
  });

  test('actualizează provider și location', async () => {
    const res = await request(app).put(`/api/appointments/${createdApptId}`).send({
      provider: 'Dr. Nou', location: 'Clinica Nouă'
    });
    expect(res.status).toBe(200);
    expect(res.body.provider).toBe('Dr. Nou');
    expect(res.body.location).toBe('Clinica Nouă');
  });

  test('id inexistent returnează 404', async () => {
    const res = await request(app).put('/api/appointments/999999').send({ provider: 'X' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/appointments/:id', () => {
  test('șterge programarea și returnează 204', async () => {
    const appt = await prisma.appointment.create({ data: { ...validAppt(), date: new Date('2024-07-01') } });
    const res = await request(app).delete(`/api/appointments/${appt.id}`);
    expect(res.status).toBe(204);

    const check = await prisma.appointment.findUnique({ where: { id: appt.id } });
    expect(check).toBeNull();
  });

  test('id inexistent returnează 404', async () => {
    const res = await request(app).delete('/api/appointments/999999');
    expect(res.status).toBe(404);
  });
});
