import React from 'react';
import { useAccount } from 'wagmi';

const HomePage = () => {
  // ✅ wagmi v1: useAccount returns an object
  const { address, isConnected } = useAccount();
  const isWalletConnected = isConnected && !!address;

  const features = [
    {
      title: "NFT Tickets",
      description: "Each ticket is unique, non-fungible token (NFT) on the blockchain, ensuring authenticity and preventing counterfeits.",
      icon: "🎟️",
    },
    {
      title: "Controlled Resale",
      description: "Event organizers can set resale rules to prevent scalping, ensuring fair pricing for secondary sales.",
      icon: "♻️",
    },
    {
      title: "Secure Ownership",
      description: "Tickets are stored securely on the blockchain, so the smart contract is always the source of truth.",
      icon: "🔒",
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        background: "url('/bg-hero.jpg') center/cover no-repeat, #0a1026",
      }}
    >
      {/* Overlay for darkening the background */}
      <div className="absolute inset-0 bg-black/70 z-0"></div>
      <main className="flex-1 flex flex-col items-center justify-center text-white px-4 relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-6 text-purple-400 drop-shadow-[0_2px_20px_rgba(192,132,252,0.8)]">
          The Future of <span className="text-white">Ticket Distribution</span>
        </h1>
        <p className="text-lg md:text-2xl text-center mb-8 max-w-2xl text-purple-200 drop-shadow-[0_2px_10px_rgba(192,132,252,0.7)]">
          A decentralized, tamper-proof blockchain-based ticketing platform that ensures fair pricing, authenticity, and secure ownership using NFTs.
        </p>
        <div className="flex gap-4 mb-16">
          <button className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg text-lg font-semibold shadow-lg transition drop-shadow-[0_2px_10px_rgba(192,132,252,0.7)]">
            Connect Wallet
          </button>
          <button className="bg-white text-purple-700 hover:bg-purple-100 px-8 py-3 rounded-lg text-lg font-semibold shadow-lg transition drop-shadow-[0_2px_10px_rgba(192,132,252,0.7)]">
            Learn More
          </button>
        </div>
        <section className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-black/60 rounded-2xl p-8 flex flex-col items-center shadow-2xl border border-purple-800 backdrop-blur-md hover:scale-105 transition-transform duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-purple-300 text-glow">{feature.title}</h3>
              <p className="text-center text-purple-100">{feature.description}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default HomePage;
