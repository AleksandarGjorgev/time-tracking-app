// /components/UserData.js
import React from 'react';

const UserData = ({ user }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">Podatki o uporabniku</h2>
      <p>Ime in priimek: {user.fullName}</p>
      <p>Uporabniško ime: {user.userName}</p>
      <p>Email: {user.email}</p>
      <p>Vrsta zaposlitve: {user.employmentType}</p>
      <p>Delovno mesto: {user.jobTitle}</p>
      <p>Aktiven: {user.isActive ? "Da" : "Ne"}</p>
    </div>
  );
};

export default UserData;
