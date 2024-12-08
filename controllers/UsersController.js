import sha1 from 'sha1';
import { ObjectID } from 'mongodb';
import Queue from 'bull';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const userQueue = new Queue('userQueue', 'redis://127.0.0.1:6379');

class UsersController {
  static async postNew(request, response) {
    const { email } = request.body;
    const { password } = request.body;

    if (!email) {
      response.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      response.status(400).json({ error: 'Missing password' });
      return;
    }

    const users = dbClient.db.collection('users');

    try {
      const user = await users.findOne({ email });
      if (user) {
        response.status(400).json({ error: 'Already exist' });
        return;
      }

      const hashedPassword = sha1(password);
      const result = await users.insertOne({ email, password: hashedPassword });
      response.status(201).json({ id: result.insertedId, email });
      userQueue.add({ userId: result.insertedId });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getMe(request, response) {
    const token = request.header('X-Token');
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);

    if (!userId) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const users = dbClient.db.collection('users');
    const idObject = new ObjectID(userId);

    try {
      const user = await users.findOne({ _id: idObject });
      if (!user) {
        response.status(401).json({ error: 'Unauthorized' });
        return;
      }
      response.status(200).json({ id: userId, email: user.email });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = UsersController;
