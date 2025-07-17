import { Router, Request, Response } from "express";
import { requireAuth, requireRole } from "../auth/middleware/rbac.middleware";
import {
    uploadSingle,
    uploadMultiple,
    handleSingleImageUpload,
    handleMultipleImageUpload,
    deleteFromCloudinary
} from "./cloudinary.handler";
import { validateCloudinaryConfig } from "./cloudinary.config";

const router = Router();

// Health check for upload service
router.get(
    "/health",
    requireAuth,
    requireRole("ADMIN", "SUPERADMIN"),
    (req, res) => {
        try {
            validateCloudinaryConfig();
            res.json({
                status: "healthy",
                message: "Cloudinary is properly configured",
                service: "cloudinary",
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: error instanceof Error ? error.message : "Configuration error"
            });
        }
    }
);

// Get upload configuration for frontend
router.get("/config", requireAuth, (req, res) => {
    const user = req.user;

    const config = {
        service: "cloudinary",
        endpoints: {
            single: "/api/uploads/single",
            multiple: "/api/uploads/multiple"
        },
        limits: {
            maxImageSize: "10MB",
            maxProfileImageSize: "5MB",
            maxProductImages: 10,
            maxProfileImages: 1
        },
        allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
        features: {
            autoWebP: true,
            autoCompress: true,
            autoResize: true,
            autoOptimize: true
        },
        userPermissions: {
            canUploadProductImages: ["ADMIN", "SUPERADMIN"].includes(
                user?.role || ""
            ),
            canUploadProfileImages: true
        }
    };

    res.json(config);
});

// Upload single image - Method 1: Remove return statement
router.post("/single", requireAuth, uploadSingle, (req: Request, res: Response) => {
    handleSingleImageUpload(req, res);
});

// Upload multiple images (for products) - Method 1: Remove return statement
router.post(
    "/multiple",
    requireAuth,
    requireRole("ADMIN", "SUPERADMIN"),
    uploadMultiple,
    (req: Request, res: Response) => {
        handleMultipleImageUpload(req, res);
    }
);


// Delete image
router.delete(
    "/:publicId",
    requireAuth,
    requireRole("ADMIN", "SUPERADMIN"),
    async (req, res) => {
        try {
            const { publicId } = req.params;
            // Decode the public_id (it might be URL encoded)
            const decodedPublicId = decodeURIComponent(publicId);

            await deleteFromCloudinary(decodedPublicId);

            res.json({
                success: true,
                message: "Image deleted successfully"
            });
        } catch (error) {
            console.error("Delete error:", error);
            res.status(500).json({
                error: "Delete failed",
                message: error instanceof Error ? error.message : "Unknown error"
            });
        }
    }
);

export default router;