import { useState } from "react";
import { useProfile } from "./useProfile";

export default function ProfilePage() {
  const { profile, updateProfile, logout } = useProfile();
  const [form, setForm] = useState({
    username: profile?.username || "",
    password: ""
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await updateProfile(form);
    alert("Profile updated");
  };

  return (
    <div className="max-w-lg mx-auto mt-8 space-y-6">
      <h2 className="text-xl font-bold">Your Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            value={profile?.email || ""}
            disabled
            className="input bg-muted text-muted-foreground"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            className="input"
            type="password"
            placeholder="Leave blank to keep current"
          />
        </div>

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={logout}
            className="text-red-500 underline"
          >
            Logout
          </button>
          <button type="submit" className="btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
