import { UploadButton } from "@uploadthing/react";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductImageUploaderProps {
  onUpload: (url: string) => void;
  disabled?: boolean;
  images?: string[];
  onRemoveImage?: (url: string) => void;
  maxImages?: number;
}

export default function ProductImageUploader({
  onUpload,
  disabled,
  images = [],
  onRemoveImage,
  maxImages = 5
}: ProductImageUploaderProps) {
  const canUploadMore = images.length < maxImages;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Product Images</label>
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
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm"
              />
              {onRemoveImage && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemoveImage(imageUrl)}
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              {index === 0 && (
                <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {canUploadMore && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <div className="flex flex-col items-center space-y-2">
            <ImageIcon className="h-8 w-8 text-gray-400" />
            <div className="text-sm text-gray-600">
              {images.length === 0 ? "Upload your first product image" : "Add more images"}
            </div>
            <UploadButton
              endpoint="imageUploader"
              appearance={{
                button: "bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
                allowedContent: "text-xs text-muted-foreground mt-2"
              }}
              content={{
                button: (
                  <div className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Choose Image</span>
                  </div>
                ),
                allowedContent: "Max 4MB • JPG, PNG, GIF, WebP"
              }}
              onClientUploadComplete={(res: { url: string }[]) => {
                if (res && res[0]?.url) {
                  onUpload(res[0].url);
                  toast.success("Image uploaded successfully!");
                } else {
                  toast.error("Failed to upload image");
                }
              }}
              onUploadError={(error: any) => {
                console.error("Upload error:", error);
                toast.error(error?.message || "Upload failed. Please try again.");
              }}
              onUploadBegin={() => {
                toast.loading("Uploading image...", { id: "upload-progress" });
              }}
              disabled={disabled || !canUploadMore}
            />
          </div>
        </div>
      )}

      {!canUploadMore && (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Maximum number of images reached ({maxImages})
          </p>
        </div>
      )}

      <div className="text-xs text-muted-foreground space-y-1">
        <p>• First image will be used as the primary product image</p>
        <p>• Recommended size: 800x800px or larger</p>
        <p>• Supported formats: JPG, PNG, GIF, WebP</p>
      </div>
    </div>
  );
}
