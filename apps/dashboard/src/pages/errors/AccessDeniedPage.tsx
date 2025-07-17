import { useNavigate } from "react-router-dom";
import { Shield, Home, ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

interface AccessDeniedPageProps {
    requiredRole?: string;
    message?: string;
}

export default function AccessDeniedPage({
    requiredRole = "ADMIN",
    message = "You don't have permission to access this page."
}: AccessDeniedPageProps) {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const getRoleInfo = (role: string) => {
        switch (role) {
            case 'SUPERADMIN':
                return {
                    badge: <Badge className="bg-purple-500 hover:bg-purple-600">Super Admin</Badge>,
                    description: "This action requires Super Administrator privileges."
                };
            case 'ADMIN':
                return {
                    badge: <Badge className="bg-blue-500 hover:bg-blue-600">Admin</Badge>,
                    description: "This action requires Administrator privileges."
                };
            default:
                return {
                    badge: <Badge variant="secondary">User</Badge>,
                    description: "This action requires special privileges."
                };
        }
    };

    const roleInfo = getRoleInfo(requiredRole);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader className="space-y-4">
                    <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
                        <Shield className="h-12 w-12 text-red-500" />
                    </div>
                    <div>
                        <CardTitle className="text-xl mb-2 flex items-center justify-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Access Denied
                        </CardTitle>
                        <CardDescription className="text-base">
                            {message}
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-sm font-medium">Required Role:</span>
                            {roleInfo.badge}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {roleInfo.description}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Button onClick={handleGoHome} className="w-full">
                            <Home className="h-4 w-4 mr-2" />
                            Go to Dashboard
                        </Button>

                        <Button variant="outline" onClick={handleGoBack} className="w-full">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Go Back
                        </Button>
                    </div>

                    <div className="text-sm text-muted-foreground">
                        <p>Contact your administrator if you need access to this feature.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}