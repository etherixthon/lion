import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import contractInfo from '../contract/contractInfo';

export default function MyTicketPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const { address, isConnected } = useAccount(); // ✅ wagmi v1

  useEffect(() => {
    const fetchTickets = async () => {
      if (!isConnected || !address) return;

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractInfo.address, contractInfo.abi, provider);

        const balance = await contract.balanceOf(address);
        const ticketList = [];

        for (let i = 0; i < Number(balance); i++) {
          const tokenId = await contract.tokenOfOwnerByIndex(address, i);
          const [price, forSale] = await contract.getTicketDetails(tokenId);
          const tokenURI = await contract.tokenURI(tokenId);

          ticketList.push({
            tokenId: tokenId.toString(),
            price: ethers.utils.formatEther(price),
            forSale,
            tokenURI,
          });
        }

        setTickets(ticketList);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [address, isConnected]);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-white">My Tickets</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <div key={ticket.tokenId} className="bg-gray-800 p-4 rounded shadow-md">
                <h3 className="font-medium text-lg text-white">Ticket #{ticket.tokenId}</h3>
                <div className="my-4">
                  <p className="text-sm text-gray-400">
                    Status:
                    <span className={`ml-2 ${ticket.forSale ? 'text-green-400' : 'text-purple-400'}`}>
                      {ticket.forSale ? `For Sale (${ticket.price} ETH)` : 'Not for Sale'}
                    </span>
                  </p>
                </div>
                <a
                  href={ticket.tokenURI}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:underline"
                >
                  View Metadata
                </a>
              </div>
            ))}
            {tickets.length === 0 && !loading && (
              <p className="text-gray-400">You don't have any tickets yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
