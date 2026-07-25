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

const router = express.Router();

// Admin User Management
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/role', updateUserRole);

// Reports Moderation
router.get('/reports', getAllReports);
router.put('/reports/:id', updateReportStatus);

// Admin Analytics
router.get('/analytics', getPlatformAnalytics);

export default router;
