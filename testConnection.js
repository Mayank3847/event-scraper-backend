require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ SUCCESS! MongoDB Connected!');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    console.log('');
    console.log('Connection details:');
    console.log('- Ready State:', mongoose.connection.readyState); // 1 = connected
    console.log('- Collections:', mongoose.connection.collections);
    console.log('');
    console.log('🎉 Your MongoDB Atlas is working perfectly!');
    process.exit(0);
  })
  .catch((error) => {
    console.log('❌ ERROR! Connection Failed!');
    console.log('Error message:', error.message);
    console.log('');
    console.log('Troubleshooting tips:');
    console.log('1. Check if password is correct: fxCt6Mta2YZXqJFx');
    console.log('2. Check if IP 0.0.0.0/0 is whitelisted in MongoDB Atlas');
    console.log('3. Check if cluster is running in MongoDB Atlas');
    process.exit(1);
  });