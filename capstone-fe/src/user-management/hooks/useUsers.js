import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../utils/api";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiFetch("/profiles/all", {
        method: "GET",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil data user");
      }

      setUsers(data.data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteUser = async (userId) => {
    if (!window.confirm("Yakin ingin menonaktifkan user ini?")) return false;

    try {
      const response = await apiFetch(`/delete-user/${userId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menonaktifkan user");
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                is_active: false,
                email: `${user.email}_deleted_${Date.now()}`, // <-- Tambahan di sini
              }
            : user,
        ),
      );

      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    deleteUser,
  };
}
