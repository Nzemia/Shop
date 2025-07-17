import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";

export default function NotFoundPage() {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader className="space-y-4">
                    <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                        <Search className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div>
                        <CardTitle className="text-4xl font-bold text-primary mb-2">404</CardTitle>
                        <CardTitle className="text-xl mb-2">Page Not Found</CardTitle>
                        <CardDescription>
                            The page you're looking for doesn't exist or has been moved.
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
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
                        <p>If you believe this is an error, please contact support.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}