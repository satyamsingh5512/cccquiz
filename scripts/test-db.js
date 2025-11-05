// Test MongoDB connection
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      process.env[key] = value;
    }
  });
}

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  console.log('🔍 Testing MongoDB connection...');
  console.log('URI:', uri.replace(/\/\/.*@/, '//<credentials>@')); // Hide credentials

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB successfully!');

    const db = client.db('quiz-platform');
    
    // Test collections
    const collections = await db.listCollections().toArray();
    console.log('\n📦 Collections:', collections.map(c => c.name).join(', ') || 'None');

    // Count documents
    const quizzesCount = await db.collection('quizzes').countDocuments();
    const questionsCount = await db.collection('questions').countDocuments();
    const attemptsCount = await db.collection('attempts').countDocuments();

    console.log('\n📊 Document counts:');
    console.log('  - Quizzes:', quizzesCount);
    console.log('  - Questions:', questionsCount);
    console.log('  - Attempts:', attemptsCount);

    if (quizzesCount === 0) {
      console.log('\n⚠️  No quizzes found. Please create a quiz from the admin dashboard.');
    }

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

testConnection();
