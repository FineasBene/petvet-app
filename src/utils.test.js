import { valPet, valAppt, valAuth } from './utils';

describe('CRUD Client-Side Validation Tests', () => {
  test('valPet: ar trebui sa detecteze erori pe toate campurile obligatorii', () => {
    const invalidPet = { name: "A", species: "", breed: "", age: -5, weight: 500, gender: "" };
    const errors = valPet(invalidPet);
    
    expect(errors.name).toBe("Min 2 caractere");
    expect(errors.species).toBe("Selectează");
    expect(errors.breed).toBe("Selectează");
    expect(errors.age).toBe("0–30");
    expect(errors.weight).toBe("0.01–200");
    expect(errors.gender).toBe("Selectează");
  });

  test('valPet: ar trebui sa valideze corect un animal (Create/Update)', () => {
    const validPet = { name: "Max", species: "Câine", breed: "Labrador", age: 3, weight: 28.5, gender: "Mascul" };
    const errors = valPet(validPet);
    expect(Object.keys(errors).length).toBe(0);
  });

  test('valAppt: validare programare fara date (Create/Update)', () => {
    const invalidAppt = { petId: null, service: "", date: "", time: "", provider: "D", location: "L" };
    const errors = valAppt(invalidAppt);
    expect(errors.petId).toBe("Selectează");
    expect(errors.provider).toBe("Min 2 caractere");
  });

  test('valAuth: ar trebui sa verifice corect credentialele', () => {
    const errors = valAuth({ email: "invalid-email", password: "123" }, false);
    expect(errors.email).toBe("Email invalid");
    expect(errors.password).toBe("Min 6 caractere");
  });
});
