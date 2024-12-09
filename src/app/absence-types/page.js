'use client';

import { useState, useEffect } from 'react';

export default function AbsenceTypes() {
  const [absenceTypes, setAbsenceTypes] = useState([]);
  const [newAbsenceType, setNewAbsenceType] = useState('');

  // Konstantna vrednost za apiUrl
  const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/api/absencetypes';

  useEffect(() => {
    // Prvič naloži podatke
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setAbsenceTypes(data));
  }, []);  // Prazna odvisnost pomeni, da bo useEffect izveden samo enkrat ob nalaganju

  const addAbsenceType = () => {
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newAbsenceType }),
    })
      .then((res) => res.json())
      .then((newType) => setAbsenceTypes([...absenceTypes, newType]));
    setNewAbsenceType('');
  };

  const deleteAbsenceType = (id) => {
    fetch(`${apiUrl}?id=${id}`, { method: 'DELETE' })
      .then(() => setAbsenceTypes(absenceTypes.filter((type) => type.id !== id)));
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Upravljanje vrst odsotnosti</h1>
      <input
        type="text"
        placeholder="Ime odsotnosti"
        value={newAbsenceType}
        onChange={(e) => setNewAbsenceType(e.target.value)}
        className="border p-2 w-full"
      />
      <button onClick={addAbsenceType} className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
        Dodaj
      </button>
      <ul>
        {absenceTypes.map((type) => (
          <li key={type.id} className="flex justify-between p-2 border">
            <span>{type.name}</span>
            <button
              onClick={() => deleteAbsenceType(type.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Izbriši
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
