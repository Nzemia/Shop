import { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import { useUsers } from "./useUsers";
import EditUserForm from "./EditUserForm";

export default function UsersPage() {
  const { users, loading, deleteUser } = useUsers();
  const [editing, setEditing] = useState<any>(null);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Users</h2>

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
                <th className="p-2">Created</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-muted/40">
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.username}</td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 flex gap-2">
                    <button onClick={() => setEditing(user)}>
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => deleteUser(user.id)}>
                      <Trash size={16} className="text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <EditUserForm user={editing} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}
