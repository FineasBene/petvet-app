const BASE = import.meta.env.VITE_API_URL || '';

// ─── JWT token management ─────────────────────────────────────────────────────
const TOKEN_KEY = 'petvet_jwt';
export const getToken  = () => localStorage.getItem(TOKEN_KEY);
export const setToken  = (t) => t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const EMO = { "Câine":"🐕","Pisică":"🐈","Papagal":"🦜","Hamster":"🐹","Iepure":"🐰","Pește":"🐟" };

let _ref = null;

async function getRef() {
  if (_ref) return _ref;
  const [species, services, statuses] = await Promise.all([
    fetch(`${BASE}/api/ref/species`, CREDS).then(r => r.json()),
    fetch(`${BASE}/api/ref/services`, CREDS).then(r => r.json()),
    fetch(`${BASE}/api/ref/statuses`, CREDS).then(r => r.json()),
  ]);
  _ref = { species, services, statuses };
  return _ref;
}

export function clearRefCache() { _ref = null; }

function petFromApi(p) {
  return {
    id: p.id, name: p.name,
    species: p.species?.name || '', breed: p.breed?.name || '',
    age: p.age, weight: p.weight, gender: p.gender,
    chip: p.chipId || '', notes: p.notes || '',
    photo: EMO[p.species?.name] || '🐾',
    vacc: p.vaccinated,
    lastVet: p.lastVetVisit ? p.lastVetVisit.split('T')[0] : null,
    ownerId: p.ownerId,
  };
}

async function petToApi(f, ownerId) {
  const { species } = await getRef();
  const sp = species.find(s => s.name === f.species);
  const br = sp?.breeds?.find(b => b.name === f.breed);
  const body = {
    name: f.name, speciesId: sp?.id,
    breedId: br?.id || null,
    age: parseFloat(f.age), weight: parseFloat(f.weight),
    gender: f.gender, chipId: f.chip || null, notes: f.notes || null,
    vaccinated: f.vacc ?? false,
  };
  if (ownerId !== undefined) body.ownerId = ownerId;
  return body;
}

function apptFromApi(a) {
  return {
    id: a.id, petId: a.petId,
    service: a.service?.name || '', cat: a.service?.category?.name || '',
    date: a.date ? a.date.split('T')[0] : '',
    time: a.time, provider: a.provider, location: a.location,
    status: a.status?.name || '', notes: a.notes || '',
  };
}

async function apptToApi(f) {
  const { services, statuses } = await getRef();
  const svc = services.find(s => s.name === f.service);
  const st  = statuses.find(s => s.name === f.status);
  return {
    petId: parseInt(f.petId), serviceId: svc?.id,
    date: f.date, time: f.time,
    provider: f.provider, location: f.location,
    statusId: st?.id, notes: f.notes || null,
  };
}

async function req(path, opts = {}) {
  const token = getToken();
  const { headers: extraHeaders, ...restOpts } = opts;
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...extraHeaders,
  };
  const res = await fetch(`${BASE}${path}`, {
    headers,
    credentials: 'include',
    ...restOpts,
  });
  if (res.status === 204) return null;
  if (res.status === 401) {
    clearToken();
    window.dispatchEvent(new CustomEvent('petvet:session-expired'));
  }
  const text = await res.text();
  if (!text) {
    if (!res.ok) throw new Error('Eroare server');
    return null;
  }
  const data = JSON.parse(text);
  if (!res.ok) throw new Error(data.error || 'Eroare server');
  return data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export async function apiLogin(email, password) {
  const data = await req('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  if (data?.token) setToken(data.token);
  return data;
}
export async function apiRegister({ name, email, phone, password, role }) {
  return req('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, phone, password, roleName: role }) });
}
export async function apiLogout() {
  clearToken();
  return req('/api/auth/logout', { method: 'POST' });
}
export async function apiMe() {
  return req('/api/auth/me');
}
export async function apiRefreshToken() {
  const data = await req('/api/auth/refresh', { method: 'POST' });
  if (data?.token) setToken(data.token);
  return data;
}
export async function apiForgotPassword(email) {
  return req('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
}
export async function apiResetPassword(token, newPassword) {
  const data = await req('/api/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, newPassword }) });
  if (data?.token) setToken(data.token);
  return data;
}

// ─── Pets ─────────────────────────────────────────────────────────────────────
export async function apiFetchPets(user) {
  const url = user.role === 'vet' || user.role === 'admin' ? '/api/pets' : `/api/pets?ownerId=${user.id}`;
  const data = await req(url);
  return data.map(petFromApi);
}
export async function apiCreatePet(f, ownerId) {
  const body = await petToApi(f, ownerId);
  const data = await req('/api/pets', { method: 'POST', body: JSON.stringify(body) });
  return petFromApi(data);
}
export async function apiUpdatePet(id, f) {
  const body = await petToApi(f);
  const data = await req(`/api/pets/${id}`, { method: 'PUT', body: JSON.stringify(body) });
  return petFromApi(data);
}
export async function apiDeletePet(id) {
  await req(`/api/pets/${id}`, { method: 'DELETE' });
}

// ─── Appointments ─────────────────────────────────────────────────────────────
export async function apiFetchAppts(user) {
  if (user.role === 'vet' || user.role === 'admin') {
    const data = await req('/api/appointments');
    return data.map(apptFromApi);
  }
  const pets = await req(`/api/pets?ownerId=${user.id}`);
  if (!pets.length) return [];
  const all = await Promise.all(pets.map(p => req(`/api/appointments?petId=${p.id}`)));
  return all.flat().map(apptFromApi);
}
export async function apiCreateAppt(f) {
  const body = await apptToApi(f);
  const data = await req('/api/appointments', { method: 'POST', body: JSON.stringify(body) });
  return apptFromApi(data);
}
export async function apiUpdateAppt(id, f) {
  const body = await apptToApi(f);
  const data = await req(`/api/appointments/${id}`, { method: 'PUT', body: JSON.stringify(body) });
  return apptFromApi(data);
}
export async function apiDeleteAppt(id) {
  await req(`/api/appointments/${id}`, { method: 'DELETE' });
}

// ─── Stats ────────────────────────────────────────────────────────────────────
export async function apiFetchStats() {
  return req('/api/stats');
}

// ─── Admin ────────────────────────────────────────────────────────────────────
export async function apiAdminUsers() {
  return req('/api/admin/users');
}
export async function apiAdminLogs(userId) {
  const qs = userId ? `?userId=${userId}` : '';
  return req(`/api/admin/logs${qs}`);
}
export async function apiAdminSuspicious() {
  return req('/api/admin/suspicious');
}
export async function apiResolveSuspicious(userId) {
  return req(`/api/admin/suspicious/${userId}/resolve`, { method: 'PUT' });
}
export async function apiAdminPermissions() {
  return req('/api/admin/permissions');
}

// ─── AI Monitoring ────────────────────────────────────────────────────────────
export async function apiAiStatus() {
  return req('/api/ai/status');
}
export async function apiAiAnalyzeUser(userId) {
  return req(`/api/ai/analyze/${userId}`, { method: 'POST' });
}
export async function apiAiAnalyzeAll() {
  return req('/api/ai/analyze-all', { method: 'POST' });
}
