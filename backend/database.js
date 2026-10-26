import mongoose from 'mongoose';

let connection;
export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!process.env.DB_URI) throw new Error('Datenbank ist nicht konfiguriert.');
  if (!connection) {
    connection = mongoose.connect(process.env.DB_URI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    }).catch(error => {
      connection = undefined;
      throw error;
    });
  }
  await connection;
  if (mongoose.connection.readyState !== 1) {
    connection = undefined;
    return connectDatabase();
  }
  return mongoose;
}
