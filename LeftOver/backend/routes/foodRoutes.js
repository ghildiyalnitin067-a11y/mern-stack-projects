import express from 'express';
import { getFoodListings, getFoodById, createFoodListing, deleteFoodListing } from '../controllers/foodController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getFoodListings)
  .post(createFoodListing);

router.route('/:id')
  .get(getFoodById)
  .delete(deleteFoodListing);

export default router;
