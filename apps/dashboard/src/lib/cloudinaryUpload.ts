import api from './api';
import { compressImage, validateImageFile } from './imageCompression';

// Upload response type
export interface UploadResponse {
    success: boolean;
    data?: {
        url: string;
        public_id: string;
        type: string;
        size: number;
        originalName: string;
    };
    error?: string;
    message?: string;
}

// Upload single image with compression
export const uploadSingleImage = async (
    file: File,
    type: 'product' | 'profile' | 'thumbnail' = 'product',
    onProgress?: (progress: number) => void
): Promise<UploadResponse> => {
    try {
        // Validate file
        const validation = validateImageFile(file);
        if (!validation.valid) {
            return {
                success: false,
                error: validation.error
            };
        }

        if (onProgress) onProgress(10);

        // Compress to WebP
        console.log(`🔄 Compressing ${file.name}...`);
        const compressedFile = await compressImage(file, type);

        if (onProgress) onProgress(50);

        // Create FormData
        const formData = new FormData();
        formData.append('image', compressedFile);

        console.log(`📤 Uploading ${compressedFile.name} (${(compressedFile.size / 1024).toFixed(1)}KB)...`);

        // Upload to API
        const response = await api.post(`/uploads/single?type=${type}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = 50 + (progressEvent.loaded / progressEvent.total) * 50;
                    onProgress(Math.round(progress));
                }
            },
        });

        console.log('✅ Upload successful:', response.data.data.url);

        return response.data;
    } catch (error: any) {
        console.error('❌ Upload failed:', error);
        return {
            success: false,
            error: error.response?.data?.message || error.message || 'Upload failed'
        };
    }
};

// Upload multiple images with compression
export const uploadMultipleImages = async (
    files: File[],
    type: 'product' | 'profile' | 'thumbnail' = 'product',
    onProgress?: (progress: number, fileName?: string) => void
): Promise<UploadResponse[]> => {
    const results: UploadResponse[] = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (onProgress) {
            onProgress((i / files.length) * 100, file.name);
        }

        try {
            const result = await uploadSingleImage(file, type);
            results.push(result);
        } catch (error) {
            results.push({
                success: false,
                error: `Failed to upload ${file.name}`
            });
        }
    }

    if (onProgress) {
        onProgress(100, 'Complete');
    }

    return results;
};

// Delete image from Cloudinary
export const deleteImage = async (publicId: string): Promise<{ success: boolean; error?: string }> => {
    try {
        // Encode the public_id for URL safety
        const encodedPublicId = encodeURIComponent(publicId);

        await api.delete(`/uploads/${encodedPublicId}`);

        return { success: true };
    } catch (error: any) {
        console.error('❌ Delete failed:', error);
        return {
            success: false,
            error: error.response?.data?.message || error.message || 'Delete failed'
        };
    }
};

// Get upload configuration from API
export const getUploadConfig = async () => {
    try {
        const response = await api.get('/uploads/config');
        return response.data;
    } catch (error) {
        console.error('Failed to get upload config:', error);
        return null;
    }
};