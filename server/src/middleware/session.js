const session = require('express-session');

const isProd = process.env.NODE_ENV === 'production';

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'petvet-secret-2024',
  resave: false,
  saveUninitialized: false,
  rolling: true, // resetează expirarea la fiecare request (inactivitate)
  cookie: {
    httpOnly: true,
    maxAge: 30 * 60 * 1000, // 30 minute
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  },
});

module.exports = sessionMiddleware;
