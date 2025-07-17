import imageCompression from 'browser-image-compression';

// Compression options for different use cases
export const compressionOptions = {
    product: {
        maxSizeMB: 1, // 1MB max
        maxWidthOrHeight: 800, // 800px max dimension
        useWebWorker: true,
        fileType: 'image/webp' as const,
        initialQuality: 0.8,
    },
    profile: {
        maxSizeMB: 0.5, // 500KB max
        maxWidthOrHeight: 400, // 400px max dimension
        useWebWorker: true,
        fileType: 'image/webp' as const,
        initialQuality: 0.8,
    },
    thumbnail: {
        maxSizeMB: 0.2, // 200KB max
        maxWidthOrHeight: 200, // 200px max dimension
        useWebWorker: true,
        fileType: 'image/webp' as const,
        initialQuality: 0.7,
    }
};

// Compress single image to WebP
export const compressImage = async (
    file: File,
    type: 'product' | 'profile' | 'thumbnail' = 'product'
): Promise<File> => {
    try {
        const options = compressionOptions[type];

        console.log(`🔄 Compressing ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB) to WebP...`);

        const compressedFile = await imageCompression(file, options);

        console.log(`✅ Compressed to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB WebP`);

        return compressedFile;
    } catch (error) {
        console.error('❌ Compression failed:', error);
        throw new Error('Failed to compress image');
    }
};

// Compress multiple images
export const compressImages = async (
    files: File[],
    type: 'product' | 'profile' | 'thumbnail' = 'product',
    onProgress?: (progress: number, fileName: string) => void
): Promise<File[]> => {
    const compressedFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (onProgress) {
            onProgress((i / files.length) * 100, file.name);
        }

        try {
            const compressed = await compressImage(file, type);
            compressedFiles.push(compressed);
        } catch (error) {
            console.error(`Failed to compress ${file.name}:`, error);
            // Skip failed files but continue with others
        }
    }

    if (onProgress) {
        onProgress(100, 'Complete');
    }

    return compressedFiles;
};

// Validate file before compression
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
        };
    }

    // Check file size (max 50MB before compression)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
        return {
            valid: false,
            error: 'File too large. Maximum size is 50MB.'
        };
    }

    return { valid: true };
};

// Get image dimensions
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve({
                width: img.naturalWidth,
                height: img.naturalHeight
            });
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
};