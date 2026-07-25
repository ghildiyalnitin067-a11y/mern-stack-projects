import express from 'express';
import { getFoodListings, getFoodById, createFoodListing, deleteFoodListing } from '../controllers/foodController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getFoodListings)
  .post(protect, createFoodListing);

router.route('/:id')
  .get(getFoodById)
  .delete(protect, deleteFoodListing);

export default router;
