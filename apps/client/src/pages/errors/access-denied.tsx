import { Link } from "react-router-dom"
import { Shield, Home, ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AccessDeniedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-md mx-auto text-center px-4">
                {/* Access Denied Illustration */}
                <div className="mb-8">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
                        <Shield className="h-16 w-16 text-destructive" />
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4 mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
                    <p className="text-muted-foreground">
                        You don't have permission to access this page.
                        This could be because you're not logged in or your account
                        doesn't have the required privileges.
                    </p>
                </div>

                {/* Reasons */}
                <div className="mb-8 p-4 bg-muted/50 rounded-lg text-left">
                    <h3 className="font-medium mb-2">This might be because:</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• You need to sign in to your account</li>
                        <li>• Your session has expired</li>
                        <li>• You don't have the required permissions</li>
                        <li>• The page is restricted to certain user roles</li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                    <Button asChild>
                        <Link to="/login">
                            Sign In
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link to="/">
                            <Home className="mr-2 h-4 w-4" />
                            Go Home
                        </Link>
                    </Button>
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                </div>

                {/* Contact Support */}
                <div className="pt-8 border-t">
                    <p className="text-sm text-muted-foreground mb-4">
                        Still having trouble? Contact our support team.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                        <Link to="/contact">
                            <Mail className="mr-2 h-4 w-4" />
                            Contact Support
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}