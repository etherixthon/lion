import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import contractInfo from '../contract/contractInfo';

export default function BuyTicketPage() {
  const { address } = useAccount();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState({ initialLoad: true });
  const [error, setError] = useState(null);
  const [processingTokenId, setProcessingTokenId] = useState(null);

  const contract = useMemo(() => {
    if (!window.ethereum) return null;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return new ethers.Contract(contractInfo.address, contractInfo.abi, provider);
  }, []);

  const fetchTickets = useCallback(async () => {
    const contractReadAsync = async (functionName, args = []) => {
      if (!contract) throw new Error('Contract not initialized');
      return contract[functionName](...args);
    };

    try {
      setLoading({ initialLoad: true });
      setError(null);

      const totalSupply = Number(await contractReadAsync('nextTicketId'));
      const availableTickets = [];
      const batchSize = 10;

      for (let i = 1; i < totalSupply; i += batchSize) {
        const batchEnd = Math.min(i + batchSize, totalSupply);
        const batch = [];

        for (let j = i; j < batchEnd; j++) {
          batch.push(
            (async () => {
              try {
                const exists = await contractReadAsync('_exists', [j]);
                if (exists) {
                  const [price, forSale] = await contractReadAsync('getTicketDetails', [j]);
                  if (forSale) {
                    const tokenURI = await contractReadAsync('tokenURI', [j]);
                    return {
                      tokenId: j,
                      price: ethers.utils.formatEther(price),
                      tokenURI,
                    };
                  }
                }
              } catch (err) {
                console.warn(`Ticket #${j} fetch failed`, err);
                return null;
              }
            })()
          );
        }

        const results = await Promise.all(batch);
        availableTickets.push(...results.filter(Boolean));
      }

      setTickets(availableTickets);
    } catch (err) {
      setError(err.message || 'Failed to fetch tickets');
    } finally {
      setLoading({ initialLoad: false });
    }
  }, [contract]);

  useEffect(() => {
    if (!contract) return;
    const filter = contract.filters.Transfer();
    contract.on(filter, fetchTickets);
    return () => contract.off(filter, fetchTickets);
  }, [contract, fetchTickets]);

  useEffect(() => {
    if (address) {
      fetchTickets();
    } else {
      setLoading({ initialLoad: false });
    }
  }, [address, fetchTickets]);

  const handleBuy = async (tokenId, price) => {
    try {
      setProcessingTokenId(tokenId);
      setError(null);

      if (!window.ethereum) throw new Error('Ethereum provider not found');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractWithSigner = new ethers.Contract(contractInfo.address, contractInfo.abi, signer);

      const tx = await contractWithSigner.buyTicket(tokenId, {
        value: ethers.utils.parseEther(price),
      });

      await tx.wait();
      alert('Ticket purchased successfully!');
      fetchTickets();
    } catch (err) {
      console.error('Buy error:', err);
      setError(err?.reason || err?.message || 'Purchase failed');
    } finally {
      setProcessingTokenId(null);
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-white text-3xl font-semibold">🎟️ Buy Tickets</h1>
          <button
            onClick={fetchTickets}
            disabled={loading.initialLoad}
            className="bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-lg text-white text-sm disabled:opacity-50"
          >
            {loading.initialLoad ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-900 text-red-200 p-4 rounded-lg">
            <div className="flex justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="hover:text-white">&times;</button>
            </div>
          </div>
        )}

        {loading.initialLoad ? (
          <div className="flex justify-center items-center py-12 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500 mr-3"></div>
            Fetching available tickets...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {tickets.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-8">
                <p>No tickets currently for sale.</p>
              </div>
            ) : (
              tickets.map(({ tokenId, price, tokenURI }) => (
                <div
                  key={tokenId}
                  className="bg-gray-900 border border-gray-700 rounded-xl p-5 hover:border-purple-500 transition"
                >
                  <h3 className="text-white text-lg font-bold mb-2">Ticket #{tokenId}</h3>
                  <p className="text-purple-300 mb-3 text-sm">Price: {price} ETH</p>
                  <a
                    href={tokenURI}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline text-sm"
                  >
                    View Details
                  </a>
                  <button
                    onClick={() => handleBuy(tokenId, price)}
                    disabled={processingTokenId === tokenId}
                    className="mt-4 w-full bg-purple-700 hover:bg-purple-800 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
                  >
                    {processingTokenId === tokenId ? 'Processing...' : 'Buy Ticket'}
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
