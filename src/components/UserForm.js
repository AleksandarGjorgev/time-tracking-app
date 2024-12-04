import { useState } from 'react';

export default function UserForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employmentType: '',
    isActive: true,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', email: '', employmentType: '', isActive: true });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow rounded">
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Ime in priimek"
        className="w-full border p-2 rounded"
        required
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="E-mail"
        className="w-full border p-2 rounded"
        required
      />
      <select
        name="employmentType"
        value={formData.employmentType}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      >
        <option value="">Izberite zaposlitev</option>
        <option value="permanent">Nedoločen čas</option>
        <option value="temporary">Določen čas</option>
        <option value="student">Študent</option>
        <option value="freelance">Avtorska</option>
        <option value="self-employed">Samostojni podjetnik</option>
      </select>
      <button className="bg-blue-500 text-white py-2 px-4 rounded">Shrani</button>
    </form>
  );
}
