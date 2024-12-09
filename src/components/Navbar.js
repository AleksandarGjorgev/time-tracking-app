"use client";

import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Odstrani JWT token
    router.push("/login"); // Preusmeri na prijavno stran
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-6">
        <h1
          className="text-2xl font-bold cursor-pointer transition duration-300 ease-in-out hover:text-yellow-300"
          onClick={() => router.push("/")}
        >
          TimeTracker
        </h1>
      </div>
      <div className="flex items-center space-x-6">
        <button
          onClick={() => router.push("/profile")}
          className="text-white hover:text-yellow-300 transition duration-200 cursor-pointer"
        >
          Profil
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition duration-300 ease-in-out"
        >
          Odjava
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
