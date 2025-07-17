import { useEffect, useState } from "react";
import api from "../../lib/api";

export const useAdmins = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const res = await api.get("/admins");
    setAdmins(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  const promote = async (email: string) => {
    await api.post("/admins/promote", { email });
    await fetch();
  };

  const demote = async (email: string) => {
    await api.post("/admins/demote", { email });
    await fetch();
  };

  return {
    admins,
    loading,
    promote,
    demote
  };
};
