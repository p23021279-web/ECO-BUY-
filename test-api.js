// Simple test to check if the API is working
const testAPI = async () => {
  try {
    console.log('🧪 Testing API connection...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:3001/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test products endpoint
    const productsResponse = await fetch('http://localhost:3001/api/products');
    const productsData = await productsResponse.json();
    console.log('✅ Products endpoint:', productsData);
    
    // Test CORS headers
    console.log('🔍 CORS Headers:');
    console.log('  Access-Control-Allow-Origin:', productsResponse.headers.get('Access-Control-Allow-Origin'));
    console.log('  Access-Control-Allow-Credentials:', productsResponse.headers.get('Access-Control-Allow-Credentials'));
    
  } catch (error) {
    console.error('❌ API Test failed:', error.message);
  }
};

testAPI();
