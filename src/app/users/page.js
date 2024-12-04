'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import UserForm from '@/components/UserForm';
import UserTable from '@/components/UserTable';

export default function Users() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    setUsers(data);
  };

  const addUser = async (user) => {
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-2xl font-bold text-gray-800">Upravljanje uporabnikov</h1>
        <UserForm onSubmit={addUser} />
        <UserTable users={users} />
      </div>
    </div>
  );
}
