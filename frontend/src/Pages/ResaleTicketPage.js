import React, { useState, useEffect, useCallback } from 'react';
import { useWalletClient } from 'wagmi';
import { ethers } from 'ethers';
import contractInfo from '../contract/contractInfo';

const ResaleTicketPage = () => {
  const { data: walletClient } = useWalletClient();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [resalePrice, setResalePrice] = useState('');
  const [error, setError] = useState('');

  const getContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(
      contractInfo.address,
      contractInfo.abi,
      signer
    );
  };

  const fetchTickets = useCallback(async () => {
    if (!walletClient) return;

    try {
      setLoading(true);
      const contract = getContract();
      const balance = await contract.balanceOf(walletClient.address);
      const ticketPromises = [];

      for (let i = 0; i < balance.toNumber(); i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(walletClient.address, i);
        const ticket = await contract.tickets(tokenId);
        const tokenURI = await contract.tokenURI(tokenId);

        ticketPromises.push({
          id: tokenId.toNumber(),
          name: ticket.name,
          price: ethers.utils.formatEther(ticket.price),
          isListed: ticket.isListed,
          tokenURI
        });
      }

      const tickets = await Promise.all(ticketPromises);
      setTickets(tickets);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [walletClient]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleListForResale = async (e) => {
    e.preventDefault();
    if (!walletClient || !selectedTicket) return;

    try {
      setLoading(true);
      const contract = getContract();
      const price = ethers.utils.parseEther(resalePrice);

      const tx = await contract.listTicketForResale(selectedTicket.id, price);
      await tx.wait();

      await fetchTickets();
      setSelectedTicket(null);
      setResalePrice('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        Loading tickets...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8 text-purple-400">My Tickets for Resale</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-red-300">{error}</span>
            <button onClick={() => setError('')} className="text-red-400 hover:text-white">
              &times;
            </button>
          </div>
        </div>
      )}

      {tickets.length === 0 ? (
        <p className="text-lg text-gray-300">You don't have any tickets available for resale.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map(ticket => (
            <div
              key={ticket.id}
              className={`border rounded-lg p-4 cursor-pointer transition ${selectedTicket?.id === ticket.id
                ? 'border-purple-500 bg-purple-800'
                : 'border-gray-700 bg-gray-900'
                }`}
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">Ticket #{ticket.id}</h3>
                <span className="text-lg font-medium">{ticket.price} ETH</span>
              </div>
              <div className="mt-4 h-40 bg-gray-900 rounded flex items-center justify-center">
                {ticket.image ? (
                  <img
                    src={ticket.image}
                    alt={`Ticket ${ticket.id}`}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-gray-500">No image available</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTicket && (
        <div className="mt-8 p-6 bg-gray-900 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">
            List Ticket #{selectedTicket.id} for Resale
          </h2>
          <div className="flex flex-col space-y-4 max-w-md">
            <div>
              <label htmlFor="resalePrice" className="block text-sm font-medium text-gray-300 mb-1">
                Resale Price (ETH)
              </label>
              <input
                type="number"
                id="resalePrice"
                min="0.01"
                step="0.01"
                value={resalePrice}
                onChange={(e) => setResalePrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-500 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter price in ETH"
              />
            </div>
            <button
              onClick={handleListForResale}
              disabled={!resalePrice}
              className={`px-6 py-2 rounded-md text-white font-medium ${!resalePrice
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
                }`}
            >
              List for Resale
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResaleTicketPage;
