'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { fetchAPI, updateAccount, changePassword } from "../api/services/route";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    employmentType: "",
    jobTitle: "",
    isActive: true,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const data = await fetchAPI("/api/Users/me");
      setUserData(data);
      setFormData({
        username: data.userName,
        fullName: data.fullName,
        email: data.email,
        phone: data.phoneNumber || "",
        employmentType: data.employmentType,
        jobTitle: data.jobTitle,
        isActive: data.isActive,
      });
    } catch (error) {
      setError("Napaka pri nalaganju podatkov o uporabniku.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
  
    // Pretvori isActive v boolean, če je to izbrano polje
    const formattedValue = name === "isActive" ? value === "true" : value;
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  };
  

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validatePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Gesli se ne ujemata.");
      return false;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("Geslo mora imeti vsaj 6 znakov.");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true);
      const updatedUser = await updateAccount(formData); // Send data to API
      setUserData(updatedUser);
      setEditing(false);
      alert("Podatki so bili posodobljeni!");
    } catch (error) {
      console.error("Error updating account:", error); // Add detailed error logging
      setError("Napaka pri posodabljanju podatkov.");
    } finally {
      setLoading(false);
    }
  };
  

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    try {
      setLoading(true);
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      alert("Geslo uspešno posodobljeno!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setChangingPassword(false);
    } catch (error) {
      setError("Napaka pri spreminjanju gesla.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mt-6 mx-auto p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4">Moj profil</h1>

        {!editing && !changingPassword && (
          <div>
            <div>
              <p><strong>Uporabniško ime:</strong> {userData.userName}</p>
              <p><strong>Ime in priimek:</strong> {userData.fullName}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Telefon:</strong> {userData.phoneNumber || "Ni podatka"}</p>
              <p><strong>Vrsta zaposlitve:</strong> {userData.employmentType}</p>
              <p><strong>Delovno mesto:</strong> {userData.jobTitle}</p>
              <p><strong>Aktivnost:</strong> {userData.isActive ? "Aktiven" : "Neaktiven"}</p>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Uredi profil
              </button>
              <button
                onClick={() => setChangingPassword(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Spremeni geslo
              </button>
            </div>
          </div>
        )}

        {editing && (
          <form onSubmit={handleAccountSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Uporabniško ime</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleAccountChange}
              placeholder="Uporabniško ime"
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Ime in priimek</label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleAccountChange}
              placeholder="Ime in priimek"
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleAccountChange}
              placeholder="Email"
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefon</label>
            <input
              id="phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleAccountChange}
              placeholder="Telefon"
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700">Vrsta zaposlitve</label>
            <input
              id="employmentType"
              type="text"
              name="employmentType"
              value={formData.employmentType}
              onChange={handleAccountChange}
              placeholder="Vrsta zaposlitve"
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Delovno mesto</label>
            <input
              id="jobTitle"
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleAccountChange}
              placeholder="Delovno mesto"
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="isActive" className="block text-sm font-medium text-gray-700">Aktiven</label>
            <select
              id="isActive"
              name="isActive"
              value={formData.isActive}
              onChange={handleAccountChange}
              className="w-full border rounded p-2"
            >
              <option value={true}>Aktiven</option>
              <option value={false}>Neaktiven</option>
            </select>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Shrani
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Prekliči
            </button>
          </div>
        </form>
        
        )}

        {changingPassword && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Trenutno geslo"
              className="w-full border rounded p-2"
              required
            />
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Novo geslo"
              className="w-full border rounded p-2"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Potrdi novo geslo"
              className="w-full border rounded p-2"
              required
            />
            {passwordError && <p className="text-red-600">{passwordError}</p>}
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Posodobi geslo
              </button>
              <button
                type="button"
                onClick={() => setChangingPassword(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Prekliči
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
