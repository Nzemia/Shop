import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, User, Lock, Save, Calendar } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/lib/auth-store'
import { authAPI } from '@/lib/api'
import { updateProfileSchema, type UpdateProfileFormData } from '@/lib/validations'

export function ProfilePage() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isPasswordSection, setIsPasswordSection] = useState(false)

    const { user } = useAuthStore()

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isDirty },
    } = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            username: user?.username || '',
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
    })

    // Memoize the reset function to prevent unnecessary re-renders
    const resetForm = useCallback(() => {
        if (user) {
            reset({
                username: user.username,
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
            })
        }
    }, [user?.username, reset])

    // Reset form when user data changes
    useEffect(() => {
        resetForm()
    }, [resetForm])

    const onSubmit = async (data: UpdateProfileFormData) => {
        try {
            setIsLoading(true)

            // Prepare update data - only include fields that have values
            const updateData: any = {}

            if (data.username && data.username !== user?.username) {
                updateData.username = data.username
            }

            if (data.newPassword && data.currentPassword) {
                updateData.newPassword = data.newPassword
                updateData.currentPassword = data.currentPassword
            }

            // Only make API call if there are changes
            if (Object.keys(updateData).length === 0) {
                toast.info('No changes to save')
                return
            }

            await authAPI.updateProfile(updateData)

            // Refresh user data
            const { verifyAuth } = useAuthStore.getState()
            await verifyAuth()

            // Reset password fields
            reset({
                username: data.username,
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
            })

            setIsPasswordSection(false)
            toast.success('Profile updated successfully!')

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to update profile'
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancelPasswordChange = () => {
        reset({
            username: watch('username'),
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        })
        setIsPasswordSection(false)
    }

    // Show loading state while user data is being fetched
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            {/* Header */}
            <div className="text-center mb-8">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                    <AvatarFallback className="text-2xl">
                        {user.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account information and preferences
                </p>
            </div>

            {/* Profile Form */}
            <div className="bg-card rounded-lg border shadow-sm">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Account Information Section */}
                    <div className="p-6 border-b">
                        <div className="flex items-center space-x-2 mb-4">
                            <User className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-semibold">Account Information</h2>
                        </div>

                        <div className="space-y-4">
                            {/* Username Field */}
                            <div className="space-y-2">
                                <label htmlFor="username" className="text-sm font-medium">
                                    Username
                                </label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    {...register('username')}
                                    className={errors.username ? 'border-destructive' : ''}
                                />
                                {errors.username && (
                                    <p className="text-sm text-destructive">{errors.username.message}</p>
                                )}
                            </div>

                            {/* Email Field - Read Only */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email Address
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="bg-muted cursor-not-allowed"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Email cannot be changed for security reasons
                                </p>
                            </div>

                            {/* Account Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Account Role
                                    </label>
                                    <div>
                                        <Badge variant="secondary" className="capitalize">
                                            {user.role.toLowerCase()}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Member Since
                                    </label>
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Account created</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Password Section */}
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <Lock className="h-5 w-5 text-primary" />
                                <h2 className="text-xl font-semibold">Password & Security</h2>
                            </div>
                            {!isPasswordSection && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsPasswordSection(true)}
                                >
                                    Change Password
                                </Button>
                            )}
                        </div>

                        {isPasswordSection ? (
                            <div className="space-y-4">
                                {/* Current Password */}
                                <div className="space-y-2">
                                    <label htmlFor="currentPassword" className="text-sm font-medium">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="currentPassword"
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            placeholder="Enter your current password"
                                            {...register('currentPassword')}
                                            className={errors.currentPassword ? 'border-destructive pr-10' : 'pr-10'}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </div>
                                    {errors.currentPassword && (
                                        <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
                                    )}
                                </div>

                                {/* New Password */}
                                <div className="space-y-2">
                                    <label htmlFor="newPassword" className="text-sm font-medium">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            type={showNewPassword ? 'text' : 'password'}
                                            placeholder="Enter your new password"
                                            {...register('newPassword')}
                                            className={errors.newPassword ? 'border-destructive pr-10' : 'pr-10'}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </div>
                                    {errors.newPassword && (
                                        <p className="text-sm text-destructive">{errors.newPassword.message}</p>
                                    )}
                                </div>

                                {/* Confirm New Password */}
                                <div className="space-y-2">
                                    <label htmlFor="confirmNewPassword" className="text-sm font-medium">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="confirmNewPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Confirm your new password"
                                            {...register('confirmNewPassword')}
                                            className={errors.confirmNewPassword ? 'border-destructive pr-10' : 'pr-10'}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </div>
                                    {errors.confirmNewPassword && (
                                        <p className="text-sm text-destructive">{errors.confirmNewPassword.message}</p>
                                    )}
                                </div>

                                {/* Password Actions */}
                                <div className="flex space-x-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancelPasswordChange}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground">
                                <p>Your password is secure. Click "Change Password" to update it.</p>
                            </div>
                        )}
                    </div>

                    {/* Save Button */}
                    <div className="p-6 border-t bg-muted/30">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">
                                {isDirty ? 'You have unsaved changes' : 'All changes saved'}
                            </p>
                            <Button
                                type="submit"
                                disabled={isLoading || !isDirty}
                                className="min-w-[120px]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}