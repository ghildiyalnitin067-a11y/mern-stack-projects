import express from 'express';
import { 
  getAllUsers, 
  updateUserStatus, 
  updateUserRole, 
  getAllReports, 
  createReport, 
  updateReportStatus, 
  getPlatformAnalytics 
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware: Require admin role
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
  }
};

// Admin User Management
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id/status', protect, adminOnly, updateUserStatus);
router.put('/users/:id/role', protect, adminOnly, updateUserRole);

// Reports Moderation
router.get('/reports', protect, adminOnly, getAllReports);
router.put('/reports/:id', protect, adminOnly, updateReportStatus);

// Admin Analytics
router.get('/analytics', protect, adminOnly, getPlatformAnalytics);

export default router;
