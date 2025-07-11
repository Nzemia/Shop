import { useUsers } from "./useUsers";

export default function EditUserForm({
  user,
  onClose
}: {
  user: any;
  onClose: () => void;
}) {
  const { updateUser } = useUsers();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const username = form.get("username") as string;
    const role = form.get("role") as string;

    await updateUser(user.id, { username, role });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-background p-6 rounded-xl w-full max-w-md space-y-4"
      >
        <h3 className="text-lg font-bold mb-2">Edit User</h3>

        <input
          type="text"
          name="username"
          defaultValue={user.username}
          placeholder="Username"
          className="input"
        />

        <label className="block text-sm font-medium">Role</label>
        <select name="role" defaultValue={user.role} className="input">
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPERADMIN">Super Admin</option>
        </select>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-muted">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
