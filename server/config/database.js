const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use the provided MongoDB URI with a specific database name
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://niveshvarun0:root@cluster0.rljc3ir.mongodb.net/ecofinds?retryWrites=true&w=majority&appName=Cluster0';
    
    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;