import { Search, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";

export default function NotFound() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleGoLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full mb-6">
            <Search className="w-10 h-10 text-slate-600 dark:text-slate-400" />
          </div>

          {/* Title */}
          <h1 className="text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            404
          </h1>

          {/* Message */}
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Page Not Found
          </h2>

          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Please
            check the URL or navigate back to a valid page.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoBack}
              className="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>

            <button
              onClick={handleGoHome}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              {isAuthenticated ? "Go to Dashboard" : "Go to Login"}
            </button>

            {!isAuthenticated && (
              <button
                onClick={handleGoLogin}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
