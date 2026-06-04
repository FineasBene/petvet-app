const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const { prisma, seedTestDb, cleanTestDb } = require('./helpers');
const { JWT_SECRET } = require('../src/middleware/auth');

beforeAll(async () => {
  await seedTestDb();
});

afterAll(async () => {
  await cleanTestDb();
  await prisma.$disconnect();
});

describe('POST /api/auth/register', () => {
  afterEach(async () => {
    await prisma.user.deleteMany({ where: { email: { contains: 'reg_' } } });
  });

  test('înregistrare cu date valide', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Nou User', email: 'reg_nou@test.ro', password: 'parola123'
    });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ email: 'reg_nou@test.ro', role: 'owner' });
    expect(res.body).not.toHaveProperty('passwordHash');
  });

  test('înregistrare fără câmpuri obligatorii returnează 400', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'reg_x@test.ro' });
    expect(res.status).toBe(400);
  });

  test('parolă prea scurtă returnează 400', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'X', email: 'reg_short@test.ro', password: '123'
    });
    expect(res.status).toBe(400);
  });

  test('email duplicat returnează 409', async () => {
    await request(app).post('/api/auth/register').send({ name: 'A', email: 'reg_dup@test.ro', password: 'abc123' });
    const res = await request(app).post('/api/auth/register').send({ name: 'B', email: 'reg_dup@test.ro', password: 'abc123' });
    expect(res.status).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  test('login cu credențiale corecte', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'test@petvet.ro', password: 'test123' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ email: 'test@petvet.ro', role: 'owner' });
    expect(res.body).not.toHaveProperty('passwordHash');
  });

  test('login returnează un JWT token valid', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'test@petvet.ro', password: 'test123' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    const decoded = jwt.verify(res.body.token, JWT_SECRET);
    expect(decoded).toMatchObject({ email: 'test@petvet.ro', role: 'owner' });
  });

  test('parolă greșită returnează 401', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'test@petvet.ro', password: 'gresita' });
    expect(res.status).toBe(401);
  });

  test('email inexistent returnează 401', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'nu@exista.ro', password: 'test123' });
    expect(res.status).toBe(401);
  });

  test('fără body returnează 400', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });
});

describe('Password Recovery (3rd-way auth)', () => {
  test('forgot-password cu email valid returneaza token de reset', async () => {
    const res = await request(app).post('/api/auth/forgot-password').send({ email: 'test@petvet.ro' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('resetToken');
    expect(res.body.resetToken).toHaveLength(64);
  });

  test('forgot-password cu email inexistent raspuns generic (securitate)', async () => {
    const res = await request(app).post('/api/auth/forgot-password').send({ email: 'nu@exista.ro' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).not.toHaveProperty('resetToken');
  });

  test('reset-password cu token valid seteaza parola noua si returneaza JWT', async () => {
    const forgot = await request(app).post('/api/auth/forgot-password').send({ email: 'test@petvet.ro' });
    const token = forgot.body.resetToken;

    const res = await request(app).post('/api/auth/reset-password').send({ token, newPassword: 'novaparola123' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');

    // Verifică că noua parolă funcționează la login
    const login = await request(app).post('/api/auth/login').send({ email: 'test@petvet.ro', password: 'novaparola123' });
    expect(login.status).toBe(200);

    // Restore parola originală
    await request(app).post('/api/auth/forgot-password').send({ email: 'test@petvet.ro' });
    const forgot2 = await request(app).post('/api/auth/forgot-password').send({ email: 'test@petvet.ro' });
    await request(app).post('/api/auth/reset-password').send({ token: forgot2.body.resetToken, newPassword: 'test123' });
  });

  test('reset-password cu token invalid returneaza 400', async () => {
    const res = await request(app).post('/api/auth/reset-password').send({ token: 'tokenfalsinvalid000000', newPassword: 'parola123' });
    expect(res.status).toBe(400);
  });

  test('token folosit de doua ori returneaza 400 (token reuse prevention)', async () => {
    const forgot = await request(app).post('/api/auth/forgot-password').send({ email: 'test@petvet.ro' });
    const token = forgot.body.resetToken;
    await request(app).post('/api/auth/reset-password').send({ token, newPassword: 'parola456' });
    const res2 = await request(app).post('/api/auth/reset-password').send({ token, newPassword: 'altaparola' });
    expect(res2.status).toBe(400);
    // Restore
    const f = await request(app).post('/api/auth/forgot-password').send({ email: 'test@petvet.ro' });
    await request(app).post('/api/auth/reset-password').send({ token: f.body.resetToken, newPassword: 'test123' });
  });
});

describe('JWT token authentication', () => {
  let validToken;

  beforeAll(async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'test@petvet.ro', password: 'test123' });
    validToken = res.body.token;
  });

  test('GET /api/auth/me cu JWT valid returnează utilizatorul', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${validToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ email: 'test@petvet.ro', role: 'owner' });
  });

  test('GET /api/auth/me fără token returnează 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('GET /api/auth/me cu token invalid returnează 401', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer token.invalid.semnat');
    expect(res.status).toBe(401);
  });

  test('GET /api/auth/me cu token expirat returnează 401', async () => {
    const expiredToken = jwt.sign(
      { id: 9999, email: 'test@petvet.ro', role: 'owner' },
      JWT_SECRET,
      { expiresIn: '-1s' }
    );
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(res.status).toBe(401);
  });

  test('POST /api/auth/refresh cu JWT valid returnează token nou', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Authorization', `Bearer ${validToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    const decoded = jwt.verify(res.body.token, JWT_SECRET);
    expect(decoded.email).toBe('test@petvet.ro');
  });
});
