require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const pool = require('./config/database');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const pagesRoutes = require('./routes/pages');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/pages', pagesRoutes);

// Serve admin panel
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/index.html'));
});

app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/login.html'));
});

// Serve individual pages
app.get('/page/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Initialize database
async function initializeDatabase() {
  try {
    console.log('Checking database connection...');
    await pool.query('SELECT NOW()');
    console.log('Database connected successfully');

    // Run migrations
    const migrationPath = path.join(__dirname, 'migrations/init.sql');
    if (fs.existsSync(migrationPath)) {
      console.log('Running database migrations...');
      const migration = fs.readFileSync(migrationPath, 'utf8');
      await pool.query(migration);
      console.log('Database migrations completed');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    console.error('Server will continue but database operations may fail');
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await initializeDatabase();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});
