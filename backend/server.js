import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pg from 'pg';
import learnRouter from './routes/learn.js';
import searchRouter from './routes/search.js';
import authRouter from './routes/auth.js';
import userdataRouter from './routes/userdata.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3001;

/* ── Session store ── */
const PgSession = connectPgSimple(session);
const pgPool    = new pg.Pool({ connectionString: process.env.DATABASE_URL });

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(session({
  store: new PgSession({
    pool: pgPool,
    tableName: 'user_sessions',
    createTableIfMissing: true,
  }),
  name: 'dsalearn.sid',
  secret: process.env.SESSION_SECRET || 'dsalearn-dev-secret-please-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
}));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth',     authRouter);
app.use('/api/userdata', userdataRouter);
app.use('/api/learn',    learnRouter);
app.use('/api/search',   searchRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
});

process.on('uncaughtException',  (err)    => console.error('Uncaught exception:',  err));
process.on('unhandledRejection', (reason) => console.error('Unhandled rejection:', reason));
