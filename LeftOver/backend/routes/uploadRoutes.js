import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';

const router = express.Router();

// POST /api/upload - Upload image to Cloudinary
router.post('/', uploadImage);

export default router;
