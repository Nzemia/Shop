import { useState, useEffect } from "react";
import { User, Mail, Lock, Save, LogOut, Shield, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "./useProfile";

interface ProfileFormData {
  username: string;
  password: string;
}

export default function ProfilePage() {
  const { profile, updateProfile, logout } = useProfile();
  const [form, setForm] = useState<ProfileFormData>({
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        username: profile.username || "",
        password: ""
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.username.trim()) {
      toast.error("Username is required");
      return;
    }

    setIsLoading(true);

    try {
      const updateData: { username: string; password?: string } = {
        username: form.username
      };
      if (form.password.trim()) {
        updateData.password = form.password;
      }

      await updateProfile(updateData);
      toast.success("Profile updated successfully!");
      setForm({ ...form, password: "" });
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "ADMIN":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 dark:bg-blue-500 rounded-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Profile Settings
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 px-6 py-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 dark:bg-white/30 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {profile.username}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Shield className="w-4 h-4 text-white/80" />
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                      profile.role
                    )}`}
                  >
                    {profile.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Email Field (Read-only) */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed focus:outline-none"
                  />
                  <div className="absolute right-3 top-3">
                    <Lock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Email cannot be changed
                </p>
              </div>

              {/* Username Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <User className="w-4 h-4" />
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                  placeholder="Enter your username"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all pr-10"
                    placeholder="Enter new password (leave blank to keep current)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Leave blank to keep your current password
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Profile
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 sm:flex-none cursor-pointer bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Role:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {profile.role}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Status:</span>
              <span className="ml-2 font-medium text-green-600 dark:text-green-400">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
