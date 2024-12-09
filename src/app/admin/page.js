import { useState, useEffect } from "react";

export default function Admin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        alert("Napaka pri nalaganju uporabnikov.");
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (res.ok) {
      alert("Uporabnik uspešno izbrisan!");
      setUsers(users.filter((user) => user.id !== id));
    } else {
      alert("Napaka pri brisanju uporabnika.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Plošča</h1>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Uporabniki</h2>
        <table className="w-full border-collapse border mt-4">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Ime</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border p-2">{user.id}</td>
                <td className="border p-2">{user.username}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Izbriši
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
