const fs = require('fs');
const path = require('path');

// Create .env file in the root directory
const envContent = `# Database Configuration
MONGODB_URI=mongodb+srv://niveshvarun0:root@cluster0.rljc3ir.mongodb.net/ecofinds?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret (change this to a secure random string in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-${Date.now()}

# Server Configuration
PORT=3001
NODE_ENV=development
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('📁 Location:', envPath);
  console.log('\n📋 Environment variables set:');
  console.log('  - MONGODB_URI: Connected to ecofinds database');
  console.log('  - JWT_SECRET: Generated unique secret');
  console.log('  - PORT: 3001');
  console.log('  - NODE_ENV: development');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
}
