// Simple test to check MongoDB connection
const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection...');
console.log('MONGO_URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    
    // Create a simple test collection
    const testSchema = new mongoose.Schema({
      name: String,
      created: { type: Date, default: Date.now }
    });
    
    const Test = mongoose.model('Test', testSchema);
    
    // Insert a test document
    return Test.create({ name: 'Connection Test' });
  })
  .then((doc) => {
    console.log('✅ Test document created:', doc);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
