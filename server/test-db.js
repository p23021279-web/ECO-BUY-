const mongoose = require('mongoose');
const User = require('./models/User');

// Test database connection and check for existing users
const testDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    
    // Connect to database
    const mongoURI = 'mongodb+srv://niveshvarun0:root@cluster0.rljc3ir.mongodb.net/ecofinds?retryWrites=true&w=majority&appName=Cluster0';
    
    await mongoose.connect(mongoURI);

    console.log('✅ MongoDB Connected successfully!');
    console.log('Database name:', mongoose.connection.name);
    
    // Check if users collection exists and count documents
    const userCount = await User.countDocuments();
    console.log(`📊 Total users in database: ${userCount}`);
    
    // List all users (without passwords)
    if (userCount > 0) {
      console.log('👥 Existing users:');
      const users = await User.find({}, 'username email createdAt');
      users.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.username} (${user.email}) - Created: ${user.createdAt}`);
      });
    } else {
      console.log('📭 No users found in database');
    }
    
    // Test creating a user
    console.log('\n🧪 Testing user creation...');
    const testUser = new User({
      username: 'testuser123',
      email: 'test@example.com',
      password: 'testpassword123'
    });
    
    try {
      await testUser.save();
      console.log('✅ Test user created successfully!');
      
      // Clean up test user
      await User.deleteOne({ _id: testUser._id });
      console.log('🧹 Test user cleaned up');
    } catch (error) {
      if (error.code === 11000) {
        console.log('⚠️  Test user already exists (duplicate key error)');
      } else {
        console.log('❌ Error creating test user:', error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

testDatabase();
