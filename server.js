const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'None'}`);
  next();
});

// Enhanced CORS configuration - Completely open for debugging
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Explicit preflight handler
app.options('*', cors());

// Database Connection
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Don't exit process, let it retry
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};

connectDB();

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Salon Clinic Backend API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000
  });
});

// Configuration check route
app.get('/api/config', (req, res) => {
  res.json({
    mongoConfigured: !!process.env.MONGO_URI,
    jwtConfigured: !!process.env.JWT_SECRET,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Debug route to test database connection
app.get('/api/test', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const connectionState = mongoose.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    
    // Test basic service query
    const Service = require('./models/Service');
    const serviceCount = await Service.countDocuments();
    
    res.json({
      database: states[connectionState],
      serviceCount: serviceCount,
      timestamp: new Date().toISOString(),
      mongoUri: process.env.MONGO_URI ? 'Set' : 'Not Set',
      jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not Set'
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/staff', require('./routes/staff'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('MongoDB URI configured:', !!process.env.MONGO_URI);
  console.log('JWT Secret configured:', !!process.env.JWT_SECRET);
});