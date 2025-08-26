// Migration script to populate MongoDB Atlas with initial data
// Run this script after setting up MongoDB Atlas connection

const mongoose = require('mongoose');
const User = require('./models/User');
const Service = require('./models/Service');
const Appointment = require('./models/Appointment');

// Sample data from your db.json
const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@salon.com", 
    password: "admin123",
    role: "admin"
  },
  {
    name: "Owner User",
    email: "owner@salon.com",
    password: "owner123", 
    role: "owner"
  },
  {
    name: "John Doe",
    email: "john@gmail.com",
    password: "John@123",
    phone: "9808470386",
    role: "user"
  }
];

const sampleServices = [
  {
    name: "Haircut & Styling",
    price: 100,
    duration: 25,
    description: "Professional haircut and styling service"
  },
  {
    name: "Manicure", 
    price: 190,
    duration: 45,
    description: "Complete nail care and polish"
  },
  {
    name: "Facial Treatment",
    price: 300,
    duration: 60,
    description: "Relaxing facial treatment for all skin types"
  },
  {
    name: "Massage Therapy",
    price: 500,
    duration: 90,
    description: "Full body relaxation massage"
  },
  {
    name: "Spa Package",
    price: 800,
    duration: 120,
    description: "Complete spa experience with multiple treatments"
  }
];

const migrateData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    await Appointment.deleteMany({});

    // Insert sample users
    await User.insertMany(sampleUsers);
    console.log('Users migrated successfully');

    // Insert sample services  
    await Service.insertMany(sampleServices);
    console.log('Services migrated successfully');

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Connect to MongoDB and run migration
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    migrateData();
  })
  .catch(err => console.error('MongoDB connection error:', err));
