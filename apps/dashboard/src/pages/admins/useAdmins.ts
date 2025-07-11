import { useEffect, useState } from "react";
import axios from "axios";

export const useAdmins = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const res = await axios.get("/api/admins");
    setAdmins(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  const promote = async (email: string) => {
    await axios.post("/api/admins/promote", { email });
    await fetch();
  };

  const demote = async (email: string) => {
    await axios.post("/api/admins/demote", { email });
    await fetch();
  };

  return {
    admins,
    loading,
    promote,
    demote
  };
};
