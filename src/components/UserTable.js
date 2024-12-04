export default function UserTable({ users, onEdit }) {
    return (
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Ime</th>
            <th className="border p-2">Telefon</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Vrsta zaposlitve</th>
            <th className="border p-2">Aktiven</th>
            <th className="border p-2">Uredi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.phone}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.employmentType}</td>
              <td className="border p-2">{user.isActive ? 'DA' : 'NE'}</td>
              <td className="border p-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => onEdit(user)}
                >
                  Uredi
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  