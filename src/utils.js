export function valPet(p) {
  const e = {};
  if (!p.name || p.name.trim().length < 2) e.name = "Min 2 caractere";
  if (!p.species) e.species = "Selectează";
  if (!p.breed) e.breed = "Selectează";
  if (p.age === "" || p.age < 0 || p.age > 30) e.age = "0–30";
  if (p.weight === "" || p.weight <= 0 || p.weight > 200) e.weight = "0.01–200";
  if (!p.gender) e.gender = "Selectează";
  return e;
}

export function valAppt(a) {
  const e = {};
  if (!a.petId) e.petId = "Selectează";
  if (!a.service) e.service = "Selectează";
  if (!a.date) e.date = "Selectează";
  if (!a.time) e.time = "Selectează";
  if (!a.provider || a.provider.trim().length < 2) e.provider = "Min 2 caractere";
  if (!a.location || a.location.trim().length < 2) e.location = "Min 2 caractere";
  return e;
}

export function valAuth(d, reg) {
  const e = {};
  if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = "Email invalid";
  if (!d.password || d.password.length < 6) e.password = "Min 6 caractere";
  if (reg) {
    if (!d.name || d.name.trim().length < 2) e.name = "Min 2 caractere";
    if (!d.phone || !/^07\d{8}$/.test(d.phone)) e.phone = "07XXXXXXXX";
    if (d.password !== d.confirm) e.confirm = "Nu coincid";
  }
  return e;
}
