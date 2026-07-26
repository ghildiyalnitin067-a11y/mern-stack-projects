import express from 'express';
import { 
  registerUser, 
  loginUser, 
  sendOtp, 
  verifyOtp, 
  getUserProfile 
} from '../controllers/authController.js';
import { authLimiter } from '../middleware/securityMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.get('/profile', protect, getUserProfile);

export default router;
