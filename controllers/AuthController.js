import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(request, response) {
    const authHeader = request.header('Authorization');
    if (!authHeader) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const encodedCreds = authHeader.split(' ')[1];
    const decodedCreds = Buffer.from(encodedCreds, 'base64').toString('ascii');
    const [email, password] = decodedCreds.split(':');

    if (!email || !password) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const hashedPassword = sha1(password);
    const user = await dbClient.db.collection('users').findOne({ email, password: hashedPassword });

    if (!user) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const token = uuidv4();
    const key = `auth_${token}`;
    await redisClient.set(key, user._id.toString(), 60 * 60 * 24);
    response.status(200).json({ token });
  }

  static async getDisconnect(request, response) {
    const token = request.header('X-Token');
    if (!token) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const key = `auth_${token}`;
    const userId = await redisClient.get(key);

    if (!userId) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await redisClient.del(key);
    response.status(204).send();
  }
}

module.exports = AuthController;
