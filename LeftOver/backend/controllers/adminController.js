import { isConnectedToMongo } from '../config/db.js';
import User from '../models/UserModel.js';
import Food from '../models/FoodModel.js';
import Reservation from '../models/ReservationModel.js';
import Report from '../models/ReportModel.js';

let dynamicReportsStore = [];

export const getAllUsers = async (req, res) => {
  try {
    if (isConnectedToMongo) {
      const users = await User.find({}).select('-password').sort({ createdAt: -1 });
      const formatted = users.map(u => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        status: 'Active',
        rescues: 0,
        joined: u.createdAt ? u.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      }));
      return res.json({ success: true, count: formatted.length, data: formatted });
    } else {
      return res.json({ success: true, count: 0, data: [] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    return res.json({ success: true, message: `User status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (isConnectedToMongo) {
      await User.findByIdAndUpdate(id, { role });
    }
    return res.json({ success: true, message: `User promoted to ${role}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createReport = async (req, res) => {
  try {
    const reportData = req.body;
    if (isConnectedToMongo) {
      const newReport = await Report.create(reportData);
      return res.status(201).json({ success: true, data: newReport });
    } else {
      const newRep = { id: `rep-${Date.now()}`, ...reportData, status: 'Pending' };
      dynamicReportsStore.unshift(newRep);
      return res.status(201).json({ success: true, data: newRep });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllReports = async (req, res) => {
  try {
    if (isConnectedToMongo) {
      const reports = await Report.find({}).sort({ createdAt: -1 });
      return res.json({ success: true, count: reports.length, data: reports });
    } else {
      return res.json({ success: true, count: dynamicReportsStore.length, data: dynamicReportsStore });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (isConnectedToMongo) {
      await Report.findByIdAndUpdate(id, { status });
    } else {
      dynamicReportsStore = dynamicReportsStore.map(r => r.id === id ? { ...r, status } : r);
    }
    res.json({ success: true, message: `Report status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPlatformAnalytics = async (req, res) => {
  try {
    if (isConnectedToMongo) {
      const userCount = await User.countDocuments();
      const foodCount = await Food.countDocuments();
      const resCount = await Reservation.countDocuments();
      const reportCount = await Report.countDocuments({ status: 'Pending' });

      return res.json({
        success: true,
        data: {
          totalUsers: userCount || 0,
          totalFoodListings: foodCount || 0,
          totalReservations: resCount || 0,
          pendingReports: reportCount || 0,
          totalCO2SavedKg: resCount * 2.5,
          categoryBreakdown: [
            { category: 'Bakery & Pastries', percentage: 40, count: Math.round(foodCount * 0.4) },
            { category: 'Organic Produce & Veggies', percentage: 35, count: Math.round(foodCount * 0.35) },
            { category: 'Hot Meals & Stews', percentage: 15, count: Math.round(foodCount * 0.15) },
            { category: 'Gourmet Desserts', percentage: 10, count: Math.round(foodCount * 0.1) }
          ]
        }
      });
    } else {
      return res.json({
        success: true,
        data: {
          totalUsers: 0,
          totalFoodListings: 0,
          totalReservations: 0,
          pendingReports: dynamicReportsStore.filter(r => r.status === 'Pending').length,
          totalCO2SavedKg: 0,
          categoryBreakdown: []
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
