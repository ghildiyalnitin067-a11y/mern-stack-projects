import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary SDK if credentials exist
const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
  console.log('[Cloudinary] SDK Configured Successfully for Cloud Storage.');
} else {
  console.log('[Cloudinary] Notice: Cloudinary environment variables not detected. Running in Local Base64 Fallback Mode.');
}

/**
 * Upload image to Cloudinary
 * @param {string} imageInput - Base64 Data URL or file path/URL
 * @param {string} folder - Folder name in Cloudinary (default: 'leftover')
 * @returns {Promise<{ success: boolean, url: string, public_id?: string }>}
 */
export const uploadToCloudinary = async (imageInput, folder = 'leftover') => {
  if (!imageInput) {
    throw new Error('No image data provided for upload');
  }

  // If Cloudinary is configured, upload to Cloudinary CDN
  if (isCloudinaryConfigured) {
    try {
      const result = await cloudinary.uploader.upload(imageInput, {
        folder: `leftover/${folder}`,
        resource_type: 'auto',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit', quality: 'auto:good' }
        ]
      });

      return {
        success: true,
        url: result.secure_url,
        public_id: result.public_id
      };
    } catch (error) {
      console.error('[Cloudinary Upload Error]:', error.message);
      // Fall back to original image input on error so user flow isn't blocked
      return {
        success: true,
        url: imageInput,
        warning: `Cloudinary upload error: ${error.message}. Used fallback format.`
      };
    }
  }

  // Fallback mode if credentials are missing
  return {
    success: true,
    url: imageInput,
    fallback: true
  };
};

export { cloudinary, isCloudinaryConfigured };
