import { UploadButton } from "@uploadthing/react";
import { toast } from "sonner";

interface ProductImageUploaderProps {
  onUpload: (url: string) => void;
  disabled?: boolean;
}

export default function ProductImageUploader({ onUpload, disabled }: ProductImageUploaderProps) {
  return (
    <div className="mb-4">
      <label htmlFor="product-image-upload" className="block font-medium mb-1">Product Image</label>
      <UploadButton
        endpoint="imageUploader"
        appearance={{
          button: "bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition focus:outline-none focus:ring-2 focus:ring-primary"
        }}
        onClientUploadComplete={(res: { url: string }[]) => {
          if (res && res[0]?.url) {
            onUpload(res[0].url);
            toast.success("Image uploaded successfully!");
          } else {
            toast.error("Failed to upload image.");
          }
        }}
        onUploadError={(error: any) => {
          toast.error(error?.message || "Upload failed");
        }}
        disabled={disabled}
        inputProps={{
          id: "product-image-upload",
          accept: "image/*"
        }}
      />
      <span className="text-xs text-muted-foreground block mt-1">Max 4MB. JPG, PNG, GIF supported.</span>
    </div>
  );
}
