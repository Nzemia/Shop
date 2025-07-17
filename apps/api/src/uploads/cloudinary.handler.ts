import { Request, Response } from 'express';
import multer from 'multer';
import cloudinary, { uploadOptions, validateCloudinaryConfig } from './cloudinary.config';

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
        }
    },
});

// Upload single image
export const uploadSingle = upload.single('image');

// Upload multiple images (max 10)
export const uploadMultiple = upload.array('images', 10);

// Upload to Cloudinary with WebP conversion
export const uploadToCloudinary = async (
    buffer: Buffer,
    type: 'product' | 'profile' | 'thumbnail' = 'product',
    filename?: string
): Promise<{ url: string; public_id: string; secure_url: string }> => {
    try {
        validateCloudinaryConfig();

        const options = uploadOptions[type];

        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    ...options,
                    public_id: filename ? `${options.folder}/${filename}` : undefined,
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else if (result) {
                        resolve({
                            url: result.url,
                            public_id: result.public_id,
                            secure_url: result.secure_url,
                        });
                    } else {
                        reject(new Error('Upload failed - no result'));
                    }
                }
            ).end(buffer);
        });
    } catch (error) {
        throw error;
    }
};

// Delete from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error;
    }
};

// Handler for single image upload
export const handleSingleImageUpload = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const type = (req.query.type as 'product' | 'profile' | 'thumbnail') || 'product';
        const result = await uploadToCloudinary(req.file.buffer, type);

        res.json({
            success: true,
            data: {
                url: result.secure_url, // Always use secure URL
                public_id: result.public_id,
                type,
                size: req.file.size,
                originalName: req.file.originalname,
            },
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            error: 'Upload failed',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Handler for multiple images upload
export const handleMultipleImageUpload = async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const type = (req.query.type as 'product' | 'profile' | 'thumbnail') || 'product';
        const uploadPromises = files.map(file =>
            uploadToCloudinary(file.buffer, type)
        );

        const results = await Promise.all(uploadPromises);

        res.json({
            success: true,
            data: results.map((result, index) => ({
                url: result.secure_url,
                public_id: result.public_id,
                type,
                size: files[index].size,
                originalName: files[index].originalname,
            })),
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            error: 'Upload failed',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};