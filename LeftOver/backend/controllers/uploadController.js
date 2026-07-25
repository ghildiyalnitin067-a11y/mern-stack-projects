import { uploadToCloudinary } from '../config/cloudinary.js';

/**
 * @desc Upload image to Cloudinary or return persistent URL
 * @route POST /api/upload
 * @access Public / Authenticated
 */
export const uploadImage = async (req, res) => {
  try {
    const { image, folder = 'general' } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide base64 image data or image URL in the request body.'
      });
    }

    const uploadResult = await uploadToCloudinary(image, folder);

    return res.status(200).json({
      success: true,
      message: uploadResult.fallback 
        ? 'Image processed using fallback mode (Configure Cloudinary env vars for CDN URLs).' 
        : 'Image uploaded successfully to Cloudinary.',
      url: uploadResult.url,
      public_id: uploadResult.public_id || null,
      isCloudinary: !uploadResult.fallback
    });
  } catch (error) {
    console.error('[Upload Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image'
    });
  }
};
