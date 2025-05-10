import React from 'react';
import "../App.css"; // Import CSS

const WalletConnect = ({ connectWallet, account }) => {
  const truncateAddress = (address) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="mb-6">
      {!account ? (
        <button
          onClick={connectWallet}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          aria-label="Connect your wallet"
        >
          Connect Wallet
        </button>
      ) : (
        <p className="text-green-700 font-semibold">
          Connected: {truncateAddress(account)}
        </p>
      )}
    </div>
  );
};

export default WalletConnect;
