import { z } from "zod"

export const registerSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3),
    password: z.string().min(6)
})

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export const forgotPasswordSchema = z.object({
    email: z.string().email()
})

export const resetPasswordSchema = z.object({
    token: z.string(),
    newPassword: z.string().min(6)
})

export const updateProfileSchema = z.object({
    username: z.string().min(3).max(20).optional(),
    currentPassword: z.string().min(6).optional(),
    newPassword: z.string().min(6).optional()
}).refine((data) => {
    // If newPassword is provided, currentPassword must also be provided
    if (data.newPassword && !data.currentPassword) {
        return false;
    }
    return true;
}, {
    message: "Current password is required when updating password",
    path: ["currentPassword"]
})
