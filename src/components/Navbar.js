"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <h1
          className="text-2xl font-bold cursor-pointer transition duration-300 ease-in-out hover:text-yellow-300"
          onClick={() => router.push("/")}
        >
          TimeTracker
        </h1>
        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => router.push("/profile")}
            className="hover:text-yellow-300 transition duration-200 cursor-pointer"
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
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-blue-700 text-white mt-2 space-y-2">
          <button
            onClick={() => {
              setIsMenuOpen(false);
              router.push("/profile");
            }}
            className="block w-full text-left px-4 py-2 hover:bg-blue-800 transition duration-200"
          >
            Profil
          </button>
          <button
            onClick={() => {
              setIsMenuOpen(false);
              handleLogout();
            }}
            className="block w-full text-left px-4 py-2 bg-red-500 hover:bg-red-600 transition duration-300 rounded-md"
          >
            Odjava
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
