// src/pages/DashboardPage.js
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

const DashboardPage = () => {
  // ✅ wagmi v1: useAccount returns an object
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();

  // Redirect to HomePage if wallet is not connected
  useEffect(() => {
    if (!isConnected || !address) {
      navigate('/');
    }
  }, [isConnected, address, navigate]);

  return (
    <main className="bg-gradient-to-br from-gray-900 to-purple-900 min-h-screen flex flex-col items-center justify-center text-white space-y-10 px-4">
      <h2 className="text-4xl font-extrabold text-purple-400">🎟️ Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
        <Link
          to="/mint"
          className="bg-purple-700 px-8 py-5 rounded-2xl shadow-lg text-lg text-center hover:bg-purple-800 transform hover:scale-105 transition duration-300 focus:outline-none"
        >
          ✨ Mint Ticket
        </Link>

        <Link
          to="/list"
          className="bg-purple-700 px-8 py-5 rounded-2xl shadow-lg text-lg text-center hover:bg-purple-800 transform hover:scale-105 transition duration-300 focus:outline-none"
        >
          ♻️ List Ticket for Resale
        </Link>

        <Link
          to="/setprice"
          className="bg-purple-700 px-8 py-5 rounded-2xl shadow-lg text-lg text-center hover:bg-purple-800 transform hover:scale-105 transition duration-300 focus:outline-none"
        >
          💰 Set Resale Price
        </Link>

        <Link
          to="/buy"
          className="bg-purple-700 px-8 py-5 rounded-2xl shadow-lg text-lg text-center hover:bg-purple-800 transform hover:scale-105 transition duration-300 focus:outline-none"
        >
          🛒 Buy Ticket
        </Link>
      </div>
    </main>
  );
};

export default DashboardPage;
