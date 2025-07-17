import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadSingleImage, uploadMultipleImages, deleteImage } from '@/lib/cloudinaryUpload';

interface ImageUploaderProps {
    onUpload: (url: string) => void;
    onRemoveImage?: (url: string) => void;
    images?: string[];
    disabled?: boolean;
    maxImages?: number;
    type?: 'product' | 'profile' | 'thumbnail';
    multiple?: boolean;
}

export default function ImageUploader({
    onUpload,
    onRemoveImage,
    images = [],
    disabled = false,
    maxImages = 5,
    type = 'product',
    multiple = true
}: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);

    const canUploadMore = images.length < maxImages;

    // Handle file selection
    const handleFiles = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);
        const filesToUpload = multiple
            ? fileArray.slice(0, maxImages - images.length)
            : [fileArray[0]];

        if (filesToUpload.length === 0) {
            toast.error(`Maximum ${maxImages} images allowed`);
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            if (multiple && filesToUpload.length > 1) {
                // Upload multiple files
                const results = await uploadMultipleImages(
                    filesToUpload,
                    type,
                    (progress, fileName) => {
                        setUploadProgress(progress);
                        if (fileName && fileName !== 'Complete') {
                            toast.loading(`Compressing ${fileName}...`, { id: 'upload-progress' });
                        }
                    }
                );

                // Process results
                let successCount = 0;
                results.forEach(result => {
                    if (result.success && result.data) {
                        onUpload(result.data.url);
                        successCount++;
                    } else {
                        console.error('Upload failed:', result.error);
                    }
                });

                toast.dismiss('upload-progress');

                if (successCount > 0) {
                    toast.success(`${successCount} image${successCount > 1 ? 's' : ''} uploaded successfully!`);
                }

                if (successCount < results.length) {
                    toast.error(`${results.length - successCount} upload${results.length - successCount > 1 ? 's' : ''} failed`);
                }
            } else {
                // Upload single file
                const result = await uploadSingleImage(
                    filesToUpload[0],
                    type,
                    (progress) => {
                        setUploadProgress(progress);
                        if (progress < 50) {
                            toast.loading(`Compressing image... ${progress}%`, { id: 'upload-progress' });
                        } else {
                            toast.loading(`Uploading... ${progress}%`, { id: 'upload-progress' });
                        }
                    }
                );

                toast.dismiss('upload-progress');

                if (result.success && result.data) {
                    onUpload(result.data.url);
                    toast.success('Image uploaded successfully!');
                } else {
                    toast.error(result.error || 'Upload failed');
                }
            }
        } catch (error) {
            toast.dismiss('upload-progress');
            toast.error('Upload failed. Please try again.');
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    }, [images.length, maxImages, multiple, onUpload, type]);

    // Handle drag and drop
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (disabled || !canUploadMore) return;

        handleFiles(e.dataTransfer.files);
    }, [disabled, canUploadMore, handleFiles]);

    // Handle file input change
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
        // Reset input value to allow same file selection
        e.target.value = '';
    }, [handleFiles]);

    // Handle image removal
    const handleRemoveImage = async (imageUrl: string) => {
        if (onRemoveImage) {
            onRemoveImage(imageUrl);

            // Try to extract public_id from Cloudinary URL and delete from cloud
            try {
                const urlParts = imageUrl.split('/');
                const publicIdWithExtension = urlParts[urlParts.length - 1];
                const publicId = publicIdWithExtension.split('.')[0];

                if (publicId) {
                    await deleteImage(`jengashop/${type}s/${publicId}`);
                }
            } catch (error) {
                console.error('Failed to delete from cloud:', error);
                // Don't show error to user as the image is already removed from UI
            }
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                    {type === 'product' ? 'Product Images' :
                        type === 'profile' ? 'Profile Image' : 'Images'}
                </label>
                <span className="text-xs text-muted-foreground">
                    {images.length}/{maxImages} images
                </span>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {images.map((imageUrl, index) => (
                        <div key={index} className="relative group aspect-square">
                            <img
                                src={imageUrl}
                                alt={`${type} image ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm"
                            />
                            {onRemoveImage && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleRemoveImage(imageUrl)}
                                    disabled={disabled || uploading}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            )}
                            {index === 0 && type === 'product' && (
                                <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                                    Primary
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Area */}
            {canUploadMore && (
                <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-300 hover:border-gray-400'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        multiple={multiple}
                        accept="image/*"
                        onChange={handleInputChange}
                        disabled={disabled || uploading}
                        className="hidden"
                        id="image-upload"
                    />

                    <div className="flex flex-col items-center space-y-2">
                        {uploading ? (
                            <>
                                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                <div className="text-sm text-gray-600">
                                    {uploadProgress < 50 ? 'Compressing to WebP...' : 'Uploading...'}
                                </div>
                                <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <div className="text-xs text-gray-500">{uploadProgress}%</div>
                            </>
                        ) : (
                            <>
                                <ImageIcon className="h-8 w-8 text-gray-400" />
                                <div className="text-sm text-gray-600">
                                    {images.length === 0
                                        ? `Upload your first ${type} image`
                                        : 'Add more images'}
                                </div>
                                <label
                                    htmlFor="image-upload"
                                    className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                                >
                                    <Upload className="h-4 w-4" />
                                    <span>Choose Images</span>
                                </label>
                                <div className="text-xs text-muted-foreground">
                                    Auto-converts to WebP • Max 10MB each • Drag & drop supported
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {!canUploadMore && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                        Maximum number of images reached ({maxImages})
                    </p>
                </div>
            )}

            <div className="text-xs text-muted-foreground space-y-1">
                <p>• Images are automatically compressed and converted to WebP format</p>
                <p>• First image will be used as the primary {type} image</p>
                <p>• Recommended size: 800x800px or larger for best quality</p>
                <p>• Supported formats: JPG, PNG, GIF, WebP</p>
            </div>
        </div>
    );
}