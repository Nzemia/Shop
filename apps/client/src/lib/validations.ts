import { z } from 'zod'

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long'),
})

export const registerSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters long')
        .max(20, 'Username must be less than 20 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .max(100, 'Password must be less than 100 characters'),
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
})

export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .max(100, 'Password must be less than 100 characters'),
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export const updateProfileSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters long')
        .max(20, 'Username must be less than 20 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
        .optional()
        .or(z.literal('')),

    currentPassword: z
        .string()
        .optional()
        .or(z.literal('')),
    newPassword: z
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .max(100, 'Password must be less than 100 characters')
        .optional()
        .or(z.literal('')),
    confirmNewPassword: z
        .string()
        .optional()
        .or(z.literal('')),
}).refine((data) => {
    // If newPassword is provided, currentPassword must also be provided
    if (data.newPassword && data.newPassword.length > 0 && (!data.currentPassword || data.currentPassword.length === 0)) {
        return false;
    }
    return true;
}, {
    message: "Current password is required when updating password",
    path: ["currentPassword"]
}).refine((data) => {
    // If newPassword is provided, confirmNewPassword must match
    if (data.newPassword && data.newPassword.length > 0 && data.newPassword !== data.confirmNewPassword) {
        return false;
    }
    return true;
}, {
    message: "New passwords don't match",
    path: ["confirmNewPassword"]
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>