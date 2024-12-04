'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-2xl font-bold">Time Tracker</div>
        <button
          className="block md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-6 h-1 bg-white mb-1" />
          <div className="w-6 h-1 bg-white mb-1" />
          <div className="w-6 h-1 bg-white" />
        </button>
        <ul
          className={`${
            isOpen ? 'block' : 'hidden'
          } md:flex md:space-x-4 absolute md:relative bg-gray-800 md:bg-transparent w-full md:w-auto top-16 left-0 md:top-auto md:left-auto`}
        >
          <li>
            <Link href="/" className="block py-2 px-4 hover:bg-gray-700">
              Domov
            </Link>
          </li>
          <li>
            <Link href="/absence-types" className="block py-2 px-4 hover:bg-gray-700">
              Vrste odsotnosti
            </Link>
          </li>
          <li>
            <Link href="/work-tracking" className="block py-2 px-4 hover:bg-gray-700">
              Beleženje časa
            </Link>
          </li>
          <li>
            <Link href="/my-hours" className="block py-2 px-4 hover:bg-gray-700">
              Moje ure
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
