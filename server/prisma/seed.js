const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Roles
  const roles = await Promise.all(
    ['admin', 'owner', 'vet'].map(name =>
      prisma.role.upsert({ where: { name }, update: {}, create: { name } })
    )
  );
  const roleMap = Object.fromEntries(roles.map(r => [r.name, r.id]));

  // Users
  const hash = r => bcrypt.hashSync(r, 10);
  await prisma.user.upsert({
    where: { email: 'admin@petvet.ro' },
    update: {},
    create: { name: 'Administrator', email: 'admin@petvet.ro', phone: '0700000000', passwordHash: hash('admin123'), roleId: roleMap.admin }
  });
  const ownerUser = await prisma.user.upsert({
    where: { email: 'demo@petvet.ro' },
    update: {},
    create: { name: 'Ion Popescu', email: 'demo@petvet.ro', phone: '0712345678', passwordHash: hash('demo123'), roleId: roleMap.owner }
  });
  await prisma.user.upsert({
    where: { email: 'vet@petvet.ro' },
    update: {},
    create: { name: 'Dr. Maria Ionescu', email: 'vet@petvet.ro', phone: '0723456789', passwordHash: hash('vet123'), roleId: roleMap.vet }
  });

  // Species & Breeds
  const speciesData = [
    { name: 'Câine', breeds: ['Labrador', 'German Shepherd', 'Bulldog', 'Poodle', 'Beagle', 'Husky', 'Golden Retriever', 'Ciobănesc Mioritic', 'Metis'] },
    { name: 'Pisică', breeds: ['Persană', 'Siameză', 'British Shorthair', 'Maine Coon', 'Bengaleză', 'Ragdoll', 'Europeană', 'Metis'] },
    { name: 'Papagal', breeds: ['Peruș', 'Nimfă', 'Loro gri african', 'Amazon', 'Macaw'] },
    { name: 'Hamster', breeds: ['Syrian', 'Roborovski', 'Campbell', 'Chinese'] },
    { name: 'Iepure', breeds: ['Angora', 'Holland Lop', 'Rex', 'Mini Rex', 'Lionhead'] },
    { name: 'Pește', breeds: ['Caras', 'Betta', 'Guppy', 'Oscar', 'Discus', 'Tetra'] },
  ];

  const speciesMap = {};
  for (const { name, breeds } of speciesData) {
    const sp = await prisma.species.upsert({ where: { name }, update: {}, create: { name } });
    speciesMap[name] = sp.id;
    for (const bname of breeds) {
      await prisma.breed.upsert({
        where: { name_speciesId: { name: bname, speciesId: sp.id } },
        update: {},
        create: { name: bname, speciesId: sp.id }
      });
    }
  }

  // Service Categories & Services
  const serviceData = [
    { cat: 'grooming', services: ['Tuns complet', 'Spălat & Uscat', 'Tăiat unghii', 'Curățat urechi', 'Periat & Styling', 'Baie medicinală'] },
    { cat: 'medical',  services: ['Consultație generală', 'Vaccinare', 'Deparazitare', 'Sterilizare', 'Control dental', 'Ecografie', 'Analize sânge'] },
    { cat: 'boarding', services: ['Cazare zi', 'Cazare noapte', 'Cazare săptămânală', 'Pensiune VIP'] },
    { cat: 'walking',  services: ['Plimbare 30min', 'Plimbare 60min', 'Jogging', 'Socializare parc'] },
  ];

  const serviceMap = {};
  for (const { cat, services } of serviceData) {
    const sc = await prisma.serviceCategory.upsert({ where: { name: cat }, update: {}, create: { name: cat } });
    for (const sname of services) {
      const svc = await prisma.service.upsert({
        where: { name_categoryId: { name: sname, categoryId: sc.id } },
        update: {},
        create: { name: sname, categoryId: sc.id }
      });
      serviceMap[sname] = svc.id;
    }
  }

  // Appointment statuses
  const statuses = ['Confirmată', 'În așteptare', 'Anulată', 'Finalizată'];
  const statusMap = {};
  for (const name of statuses) {
    const s = await prisma.appointmentStatus.upsert({ where: { name }, update: {}, create: { name } });
    statusMap[name] = s.id;
  }

  // Demo pets
  const breedRec = async (bname, spName) => {
    const r = await prisma.breed.findFirst({ where: { name: bname, speciesId: speciesMap[spName] } });
    return r?.id ?? null;
  };

  const pets = [
    { name: 'Rex',    speciesId: speciesMap['Câine'],  breedId: await breedRec('Labrador', 'Câine'),   age: 3,  weight: 28.5, gender: 'Mascul',  vaccinated: true,  lastVetVisit: new Date('2024-01-15') },
    { name: 'Mimi',   speciesId: speciesMap['Pisică'], breedId: await breedRec('Persană', 'Pisică'),   age: 2,  weight: 4.2,  gender: 'Femelă',  vaccinated: true,  lastVetVisit: new Date('2024-02-20') },
    { name: 'Tweety', speciesId: speciesMap['Papagal'],breedId: await breedRec('Nimfă', 'Papagal'),    age: 1,  weight: 0.09, gender: 'Mascul',  vaccinated: false, lastVetVisit: null },
    { name: 'Hammy',  speciesId: speciesMap['Hamster'],breedId: await breedRec('Syrian', 'Hamster'),   age: 1,  weight: 0.12, gender: 'Mascul',  vaccinated: false, lastVetVisit: null },
    { name: 'Bunny',  speciesId: speciesMap['Iepure'], breedId: await breedRec('Holland Lop', 'Iepure'),age:2, weight: 2.1,  gender: 'Femelă',  vaccinated: true,  lastVetVisit: new Date('2024-03-10') },
    { name: 'Nemo',   speciesId: speciesMap['Pește'],  breedId: await breedRec('Betta', 'Pește'),      age: 1,  weight: 0.01, gender: 'Mascul',  vaccinated: false, lastVetVisit: null },
  ];

  const petIds = [];
  for (const p of pets) {
    const pet = await prisma.pet.create({ data: { ...p, ownerId: ownerUser.id } });
    petIds.push(pet.id);
  }

  // Demo appointments
  const appts = [
    { petId: petIds[0], serviceName: 'Vaccinare',          date: new Date('2024-04-10'), time: '10:00', provider: 'Dr. Ionescu',  location: 'Clinica PetVet', statusName: 'Finalizată' },
    { petId: petIds[0], serviceName: 'Consultație generală',date: new Date('2024-05-15'), time: '11:00', provider: 'Dr. Popescu',  location: 'Clinica PetVet', statusName: 'Confirmată' },
    { petId: petIds[1], serviceName: 'Tuns complet',        date: new Date('2024-04-20'), time: '09:00', provider: 'Salon PetLook',location: 'Salon PetLook',  statusName: 'Finalizată' },
    { petId: petIds[1], serviceName: 'Control dental',      date: new Date('2024-06-01'), time: '14:00', provider: 'Dr. Ionescu',  location: 'Clinica PetVet', statusName: 'În așteptare' },
    { petId: petIds[0], serviceName: 'Deparazitare',        date: new Date('2024-03-05'), time: '10:30', provider: 'Dr. Popescu',  location: 'Clinica PetVet', statusName: 'Finalizată' },
    { petId: petIds[2], serviceName: 'Consultație generală',date: new Date('2024-05-22'), time: '16:00', provider: 'Dr. Ionescu',  location: 'Clinica PetVet', statusName: 'Confirmată' },
    { petId: petIds[4], serviceName: 'Vaccinare',           date: new Date('2024-04-28'), time: '09:30', provider: 'Dr. Popescu',  location: 'Clinica PetVet', statusName: 'Confirmată' },
    { petId: petIds[0], serviceName: 'Cazare noapte',       date: new Date('2024-05-30'), time: '18:00', provider: 'PetHotel',     location: 'PetHotel Titan', statusName: 'În așteptare' },
    { petId: petIds[1], serviceName: 'Spălat & Uscat',      date: new Date('2024-06-10'), time: '10:00', provider: 'Salon PetLook',location: 'Salon PetLook',  statusName: 'În așteptare' },
    { petId: petIds[0], serviceName: 'Plimbare 60min',      date: new Date('2024-05-18'), time: '08:00', provider: 'PetWalker',    location: 'Parcul Herăstrău', statusName: 'Anulată' },
  ];

  for (const a of appts) {
    await prisma.appointment.create({
      data: {
        petId: a.petId,
        serviceId: serviceMap[a.serviceName],
        date: a.date,
        time: a.time,
        provider: a.provider,
        location: a.location,
        statusId: statusMap[a.statusName],
        notes: null,
      }
    });
  }

  // Permissions & RolePermissions
  const perms = [
    'pets:read', 'pets:write', 'pets:delete',
    'appointments:read', 'appointments:write', 'appointments:delete',
    'users:manage', 'admin:logs', 'admin:suspicious', 'stats:read'
  ];
  const permMap = {};
  for (const name of perms) {
    const p = await prisma.permission.upsert({ where: { name }, update: {}, create: { name } });
    permMap[name] = p.id;
  }

  const rolePerms = {
    admin: perms,
    vet:   ['pets:read', 'appointments:read', 'appointments:write', 'stats:read'],
    owner: ['pets:read', 'pets:write', 'appointments:read', 'appointments:write', 'stats:read']
  };

  for (const [roleName, allowedPerms] of Object.entries(rolePerms)) {
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    for (const pName of allowedPerms) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permMap[pName] } },
        update: {},
        create: { roleId: role.id, permissionId: permMap[pName] }
      });
    }
  }

  console.log('✅ Seed completat cu succes!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
