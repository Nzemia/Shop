import { useState } from "react";
import { UserPlus, UserMinus } from "lucide-react";
import { useAdmins } from "./useAdmins";

export default function AdminsPage() {
  const { admins, promote, demote, loading } = useAdmins();
  const [email, setEmail] = useState("");

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Admins & Superadmins</h2>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await promote(email);
          setEmail("");
        }}
        className="flex gap-2 mb-6 flex-wrap"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="User email to promote"
          className="input w-full sm:w-auto"
        />
        <button type="submit" className="btn-primary flex items-center gap-2">
          <UserPlus size={16} />
          Promote
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-10">Loading...</div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">Email</th>
                <th className="p-2">Username</th>
                <th className="p-2">Role</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b hover:bg-muted/40">
                  <td className="p-2">{admin.email}</td>
                  <td className="p-2">{admin.username}</td>
                  <td className="p-2">{admin.role}</td>
                  <td className="p-2">
                    {admin.role === "ADMIN" && (
                      <button
                        onClick={() => demote(admin.email)}
                        className="text-red-500 flex items-center gap-1"
                      >
                        <UserMinus size={16} />
                        Demote
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
