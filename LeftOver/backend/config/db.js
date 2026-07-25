import mongoose from 'mongoose';
import dns from 'dns';

// Fix Node.js DNS SRV lookup for MongoDB Atlas on Windows networks
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Fallback if custom DNS setting is restricted
}

export let isConnectedToMongo = false;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/leftover_db', {
      serverSelectionTimeoutMS: 5000
    });
    isConnectedToMongo = true;
    console.log(`[Database] MongoDB Atlas Connected Successfully! Host: ${conn.connection.host}`);
  } catch (error) {
    isConnectedToMongo = false;
    console.warn(`[Database] MongoDB Connection Warning: ${error.message}`);
    console.log('[Database] Operating with fallback In-Memory Secure Store.');
  }
};
