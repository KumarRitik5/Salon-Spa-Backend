const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['https://luxe-beauty-salon.vercel.app', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Load JSON data
const dbPath = path.join(__dirname, '..', 'db.json');
let db = {};

try {
  const dbData = fs.readFileSync(dbPath, 'utf8');
  db = JSON.parse(dbData);
  console.log('Database loaded successfully');
} catch (error) {
  console.error('Error loading database:', error);
  db = { services: [], appointments: [], users: [] };
}

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: '✨ Luxe Beauty Salon API is running!', 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: db.services?.length || 0
  });
});

// Services endpoints
app.get('/services', (req, res) => {
  res.json(db.services || []);
});

app.get('/services/:id', (req, res) => {
  const service = db.services?.find(s => s.id == req.params.id);
  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }
  res.json(service);
});

// Appointments endpoints
app.get('/appointments', (req, res) => {
  res.json(db.appointments || []);
});

app.post('/appointments', (req, res) => {
  const newAppointment = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  if (!db.appointments) db.appointments = [];
  db.appointments.push(newAppointment);
  
  // Save to file (in production, you'd use a real database)
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Error saving appointment' });
  }
});

// Users endpoints (basic)
app.get('/users', (req, res) => {
  res.json(db.users || []);
});

app.post('/users', (req, res) => {
  const newUser = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  if (!db.users) db.users = [];
  db.users.push(newUser);
  
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error saving user' });
  }
});

// Auth endpoints (basic implementation)
app.post('/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // Check if user exists
  const existingUser = db.users?.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password, // In production, hash the password
    role: 'customer',
    createdAt: new Date().toISOString()
  };
  
  if (!db.users) db.users = [];
  db.users.push(newUser);
  
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.status(201).json({ 
      message: 'User registered successfully',
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = db.users?.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  res.json({
    message: 'Login successful',
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token: 'fake-jwt-token-' + user.id // In production, use real JWT
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// For Vercel serverless
module.exports = app;

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✨ Luxe Beauty Salon API running on port ${PORT}`);
    console.log(`Services available: ${db.services?.length || 0}`);
  });
}
