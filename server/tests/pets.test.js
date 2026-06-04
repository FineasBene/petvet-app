const request = require('supertest');
const app = require('../src/app');
const { prisma, seedTestDb, cleanTestDb } = require('./helpers');

let ctx;
let createdPetId;

beforeAll(async () => {
  ctx = await seedTestDb();
});

afterAll(async () => {
  await cleanTestDb();
  await prisma.$disconnect();
});

const validPet = () => ({
  name: 'Azor',
  speciesId: ctx.speciesMap['Câine'],
  breedId: ctx.breedId,
  age: 2,
  weight: 15.5,
  gender: 'Mascul',
  ownerId: ctx.user.id
});

describe('POST /api/pets', () => {
  test('creează un animal valid', async () => {
    const res = await request(app).post('/api/pets').send(validPet());
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'Azor', gender: 'Mascul' });
    expect(res.body.species.name).toBe('Câine');
    createdPetId = res.body.id;
  });

  test('fără câmpuri obligatorii returnează 400', async () => {
    const res = await request(app).post('/api/pets').send({ name: 'Fara specie' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/pets', () => {
  test('returnează lista de animale', async () => {
    const res = await request(app).get('/api/pets');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('filtrare după speciesId', async () => {
    const res = await request(app).get(`/api/pets?speciesId=${ctx.speciesMap['Câine']}`);
    expect(res.status).toBe(200);
    res.body.forEach(p => expect(p.species.name).toBe('Câine'));
  });

  test('filtrare după vaccinated=true', async () => {
    await prisma.pet.create({ data: { ...validPet(), name: 'VaccinatPet', vaccinated: true } });
    const res = await request(app).get('/api/pets?vaccinated=true');
    expect(res.status).toBe(200);
    res.body.forEach(p => expect(p.vaccinated).toBe(true));
  });

  test('filtrare după search', async () => {
    const res = await request(app).get('/api/pets?search=Azor');
    expect(res.status).toBe(200);
    expect(res.body.some(p => p.name === 'Azor')).toBe(true);
  });
});

describe('GET /api/pets/:id', () => {
  test('returnează animalul cu id corect', async () => {
    const res = await request(app).get(`/api/pets/${createdPetId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdPetId);
  });

  test('id inexistent returnează 404', async () => {
    const res = await request(app).get('/api/pets/999999');
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/pets/:id', () => {
  test('actualizează câmpurile trimise', async () => {
    const res = await request(app).put(`/api/pets/${createdPetId}`).send({ name: 'Azor Modificat', weight: 18 });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Azor Modificat');
    expect(res.body.weight).toBe(18);
  });

  test('id inexistent returnează 404', async () => {
    const res = await request(app).put('/api/pets/999999').send({ name: 'X' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/pets/:id', () => {
  test('șterge animalul și returnează 204', async () => {
    const pet = await prisma.pet.create({ data: { ...validPet(), name: 'DeShters' } });
    const res = await request(app).delete(`/api/pets/${pet.id}`);
    expect(res.status).toBe(204);

    const check = await prisma.pet.findUnique({ where: { id: pet.id } });
    expect(check).toBeNull();
  });

  test('id inexistent returnează 404', async () => {
    const res = await request(app).delete('/api/pets/999999');
    expect(res.status).toBe(404);
  });
});
