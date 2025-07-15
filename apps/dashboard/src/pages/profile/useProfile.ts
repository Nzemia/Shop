import { useEffect, useState } from "react";
import axios from "axios";

export const useProfile = () => {
  const [profile, setProfile] = useState<any>(null);

  const fetch = async () => {
    const res = await axios.get("/api/admin/me"); 
    setProfile(res.data);
  };

  useEffect(() => {
    fetch();
  }, []);

  const updateProfile = async (data: {
    username: string;
    password?: string;
  }) => {
    await axios.put("/api/admin/me", data);
    await fetch();
  };

  const logout = async () => {
    // Clear token if stored in localStorage
    localStorage.clear();
    window.location.href = "/login";
  };

  return {
    profile,
    updateProfile,
    logout
  };
};
