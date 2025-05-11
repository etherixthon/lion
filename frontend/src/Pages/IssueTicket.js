import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { NFTStorage } from 'nft.storage';
import { ethers } from 'ethers';
import { useWalletClient } from 'wagmi';
import contractInfo from '../contract/contractInfo';

const NFT_STORAGE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEZBQkM4RjlDMDNCNzU2NjVERDM5NzZGOTc2Nzc2ODYwMERFNzQ4OTgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwOTk5ODI1NzU1MywibmFtZSI6InRpY2tldGluZyJ9.Q4mM5qHdz1_7OT-zbOIw_F3ZJrxE5rb7g5kQ4C9Uh5c';

export default function IssueTicket() {
  const [ticketData, setTicketData] = useState({
    name: '',
    description: '',
    image: null,
    eventDate: '',
    venue: '',
    seatNumber: ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState({ upload: false, mint: false });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { data: walletClient } = useWalletClient();

  const contract = useMemo(() => {
    if (!window.ethereum) return null;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(
      contractInfo.address,
      contractInfo.abi,
      signer
    );
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }
      setTicketData(prev => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
      setError(null);
    }
  };

  const uploadMetadata = async () => {
    if (!ticketData.image) throw new Error('Please upload an image for the ticket');

    const client = new NFTStorage({ token: NFT_STORAGE_KEY });

    const metadata = await client.store({
      name: ticketData.name,
      description: ticketData.description,
      image: ticketData.image,
      attributes: [
        { trait_type: "Event Date", value: ticketData.eventDate },
        { trait_type: "Venue", value: ticketData.venue },
        { trait_type: "Seat", value: ticketData.seatNumber || "General Admission" }
      ],
      properties: {
        ticket_type: "Event Admission"
      }
    });

    return metadata.url;
  };

  const mintTicket = async (e) => {
    e.preventDefault();
    if (!walletClient) {
      setError('Please connect your wallet first');
      return;
    }

    if (!contract) {
      setError('Contract not initialized');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const contractOwner = await contract.owner();
      if (walletClient.address.toLowerCase() !== contractOwner.toLowerCase()) {
        throw new Error("Only contract owner can mint tickets");
      }

      const tokenURI = await uploadMetadata();

      const tx = await contract.mint(walletClient.address, tokenURI);
      await tx.wait();

      alert(`Ticket minted successfully! Transaction hash: ${tx.hash}`);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating ticket:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-purple-900 p-4 md:p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-7xl md:text-4xl font-extrabold text-purple-400 mb-6 text-center">
          🎟️ Create New Event Ticket
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-red-300">{error}</span>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-white">
                &times;
              </button>
            </div>
          </div>
        )}

        <form onSubmit={mintTicket} className="bg-gray-800 rounded-2xl border border-purple-700 p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">Ticket Image *</label>
              <div className="border-2 border-dashed border-purple-700 rounded-lg p-4 text-center hover:border-purple-500 transition-colors">
                {previewImage ? (
                  <>
                    <img src={previewImage} alt="Ticket preview" className="max-h-64 mx-auto mb-4 rounded-lg shadow-lg" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="ticketImage" />
                    <label htmlFor="ticketImage" className="inline-block px-4 py-2 bg-purple-700 hover:bg-purple-800 rounded-lg cursor-pointer transition-colors">
                      Change Image
                    </label>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <p className="text-gray-400">Upload your ticket image</p>
                      <p className="text-xs mt-1 text-purple-500">PNG, JPG, GIF (max 10MB)</p>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="ticketImage" />
                    <label htmlFor="ticketImage" className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer transition-colors">
                      Select Image
                    </label>
                  </>
                )}
              </div>
            </div>

          {/* Form Fields */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <label className="block text-sm font-medium text-purple-300 mb-1">Ticket Name *</label>
              <input type="text" name="name" value={ticketData.name} onChange={handleInputChange} className="w-full bg-gray-800 border border-purple-600 rounded-lg px-4 py-2 text-white placeholder-purple-400" placeholder="VIP Concert Ticket" required />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-purple-300 mb-1">Description *</label>
              <textarea name="description" value={ticketData.description} onChange={handleInputChange} className="w-full bg-gray-800 border border-purple-600 rounded-lg px-4 py-2 text-white placeholder-purple-400" placeholder="Access to VIP area for Artist Name concert" rows="3" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">Event Date *</label>
                <input type="date" name="eventDate" value={ticketData.eventDate} onChange={handleInputChange} className="w-full bg-gray-800 border border-purple-600 rounded-lg px-4 py-2 text-white" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">Seat Number</label>
                <input type="text" name="seatNumber" value={ticketData.seatNumber} onChange={handleInputChange} className="w-full bg-gray-800 border border-purple-600 rounded-lg px-4 py-2 text-white placeholder-purple-400" placeholder="General Admission" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-purple-300 mb-1">Venue *</label>
              <input type="text" name="venue" value={ticketData.venue} onChange={handleInputChange} className="w-full bg-gray-800 border border-purple-600 rounded-lg px-4 py-2 text-white placeholder-purple-400" placeholder="Madison Square Garden" required />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={() => navigate('/dashboard')} className="px-4 py-2 rounded-lg border border-purple-600 hover:bg-gray-800 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading.upload || loading.mint} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium disabled:opacity-50 transition-colors flex items-center">
                {loading.upload || loading.mint ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {loading.upload ? 'Uploading...' : 'Minting...'}
                  </>
                ) : (
                  'Create Ticket'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
  );
}
