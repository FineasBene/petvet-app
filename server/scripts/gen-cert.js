const selfsigned = require('selfsigned');
const fs = require('fs');
const path = require('path');
const os = require('os');

function getLocalIPs() {
  const ips = ['127.0.0.1'];
  for (const iface of Object.values(os.networkInterfaces())) {
    for (const alias of iface) {
      if (alias.family === 'IPv4' && !alias.internal) ips.push(alias.address);
    }
  }
  return ips;
}

async function main() {
  const certDir = path.join(__dirname, '../../certs');
  if (!fs.existsSync(certDir)) fs.mkdirSync(certDir, { recursive: true });

  const localIPs = getLocalIPs();
  console.log('IP-uri detectate:', localIPs.join(', '));

  const attrs = [
    { name: 'commonName', value: 'petvet-local' },
    { name: 'organizationName', value: 'PetVet' },
  ];

  const altNames = [
    { type: 'dns', value: 'localhost' },
    ...localIPs.map(ip => ({ type: 'ip', value: ip })),
  ];

  const pems = await selfsigned.generate(attrs, {
    days: 365,
    algorithm: 'sha256',
    extensions: [{ name: 'subjectAltName', altNames }],
  });

  fs.writeFileSync(path.join(certDir, 'server.key'), pems.private);
  fs.writeFileSync(path.join(certDir, 'server.crt'), pems.cert);

  console.log('Certificat generat: certs/server.key + certs/server.crt');
  console.log('Acoperire SAN: localhost,', localIPs.join(', '));
  console.log('');
  console.log('Porneste serverul:  cd server && npm run dev');
  console.log('Porneste frontend:  npm run dev  (din radacina proiectului)');
  localIPs.filter(ip => ip !== '127.0.0.1').forEach(ip => {
    console.log(`Acceseaza de pe telefon: https://${ip}:5173`);
  });
}

main().catch(err => { console.error('Eroare:', err.message); process.exit(1); });
