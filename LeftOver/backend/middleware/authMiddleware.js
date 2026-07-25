import jwt from 'jsonwebtoken';
import { isConnectedToMongo } from '../config/db.js';
import User from '../models/UserModel.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_leftover_jwt_key_2026_secure_shield');

      if (isConnectedToMongo) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        // Fallback user object
        req.user = {
          id: decoded.id,
          name: decoded.name || 'Community Member',
          email: decoded.email || 'user@example.com',
          role: decoded.role || 'user'
        };
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed or expired.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no Bearer token provided.' });
  }
};
