import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Upload options for different types
export const uploadOptions = {
    // Product images - high quality, WebP conversion
    product: {
        folder: 'jengashop/products',
        transformation: [
            { width: 800, height: 800, crop: 'fill', quality: 'auto:good' },
            { format: 'webp' }
        ],
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        max_file_size: 10000000, // 10MB
    },

    // Profile images - smaller, optimized
    profile: {
        folder: 'jengashop/profiles',
        transformation: [
            { width: 400, height: 400, crop: 'fill', quality: 'auto:good' },
            { format: 'webp' }
        ],
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        max_file_size: 5000000, // 5MB
    },

    // Thumbnails - very small, fast loading
    thumbnail: {
        folder: 'jengashop/thumbnails',
        transformation: [
            { width: 200, height: 200, crop: 'fill', quality: 'auto:low' },
            { format: 'webp' }
        ],
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        max_file_size: 2000000, // 2MB
    }
};

// Validation helper
export const validateCloudinaryConfig = () => {
    const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];

    // Debug logging
    console.log('🔍 Checking Cloudinary env vars:');
    requiredEnvVars.forEach(envVar => {
        console.log(`  ${envVar}: ${process.env[envVar] ? '✅ Set' : '❌ Missing'}`);
    });

    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

    if (missing.length > 0) {
        throw new Error(`Missing required Cloudinary environment variables: ${missing.join(', ')}`);
    }

    return true;
};