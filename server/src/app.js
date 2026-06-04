require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const express    = require('express');
const cors       = require('cors');
const sessionMiddleware = require('./middleware/session');
const { loadUser }      = require('./middleware/auth');
const rateLimit         = require('./middleware/rateLimit');
const errorHandler      = require('./middleware/errorHandler');

const app = express();

app.set('trust proxy', 1);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(sessionMiddleware);
app.use(loadUser);
app.use(rateLimit);

app.use('/api/auth',         require('./routes/auth'));
app.use('/api/pets',         require('./routes/pets'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/users',        require('./routes/users'));
app.use('/api/stats',        require('./routes/stats'));
app.use('/api/ref',          require('./routes/reference'));
app.use('/api/admin',        require('./routes/admin'));
app.use('/api/chat',         require('./routes/chat'));
app.use('/api/ai',           require('./routes/ai'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

module.exports = app;
