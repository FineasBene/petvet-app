const { execSync } = require('child_process');
const path = require('path');

module.exports = async function () {
  // Încarcă .env.test și rulează migrarea pe petvet_test
  require('dotenv').config({ path: path.resolve(__dirname, '../.env.test') });
  process.env.DATABASE_URL = 'mysql://root:@localhost:3306/petvet_test';

  execSync('npx prisma migrate deploy', {
    cwd: path.resolve(__dirname, '..'),
    env: { ...process.env, DATABASE_URL: 'mysql://root:@localhost:3306/petvet_test' },
    stdio: 'inherit',
  });
};
