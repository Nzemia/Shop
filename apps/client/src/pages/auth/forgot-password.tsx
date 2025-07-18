import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2, Mail } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authAPI } from '@/lib/api'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations'

export function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    })

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            setIsLoading(true)
            await authAPI.forgotPassword(data)
            setIsSuccess(true)
            toast.success('Password reset link sent to your email!')
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to send reset link'
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="w-full max-w-md space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <Link to="/" className="inline-flex items-center space-x-2 mb-8">
                            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-xl">J</span>
                            </div>
                            <span className="font-bold text-2xl">JengaShop</span>
                        </Link>
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="text-3xl font-bold">Check your email</h1>
                        <p className="text-muted-foreground mt-2">
                            We've sent a password reset link to your email address.
                        </p>
                    </div>

                    {/* Success Card */}
                    <div className="bg-card p-8 rounded-lg border shadow-sm space-y-6">
                        <div className="space-y-4 text-center">
                            <p className="text-sm text-muted-foreground">
                                If you don't see the email in your inbox, please check your spam folder.
                                The reset link will expire in 15 minutes.
                            </p>

                            <div className="space-y-3">
                                <Button className="w-full" asChild>
                                    <Link to="/login">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Sign In
                                    </Link>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setIsSuccess(false)}
                                >
                                    Try different email
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center space-x-2 mb-8">
                        <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-xl">J</span>
                        </div>
                        <span className="font-bold text-2xl">JengaShop</span>
                    </Link>
                    <h1 className="text-3xl font-bold">Forgot your password?</h1>
                    <p className="text-muted-foreground mt-2">
                        No worries! Enter your email and we'll send you a reset link.
                    </p>
                </div>

                {/* Forgot Password Form */}
                <div className="bg-card p-8 rounded-lg border shadow-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email Address
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                {...register('email')}
                                className={errors.email ? 'border-destructive' : ''}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending reset link...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </Button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center text-sm text-primary hover:underline"
                        >
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}