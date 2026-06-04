// Încarcă variabilele din .env.test înainte de orice test
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.test') });
