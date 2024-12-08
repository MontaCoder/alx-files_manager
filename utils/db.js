import { MongoClient } from 'mongodb';

const HOST = process.env.DB_HOST || 'localhost';
const PORT = process.env.DB_PORT || 27017;
const DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${HOST}:${PORT}`;

class DBClient {
  constructor() {
    this.client = new MongoClient(url);
    this.connectToDatabase();
  }

  async connectToDatabase() {
    try {
      await this.client.connect();
      this.db = this.client.db(DATABASE);
    } catch (err) {
      console.error('Failed to connect to the database:', err);
    }
  }

  isAlive() {
    // Check if the database connection is established
    return this.client && this.client.topology && this.client.topology.isConnected();
  }

  async nbUsers() {
    const users = this.db.collection('users');
    return users.countDocuments();
  }

  async nbFiles() {
    const files = this.db.collection('files');
    return files.countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
