const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

let client;


async function connectToServer(callback) {
  if (client) return callback();

  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
    callback();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

function getDb() {
  if (!client) {
    throw new Error('Must connect to MongoDB before calling getDb');
  }
  return client.db();
}

module.exports = { connectToServer, getDb };
