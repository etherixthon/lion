# Etherix 2.0 - NFT Ticket Platform

A decentralized platform for minting, buying, and reselling NFT tickets built with React and Ethereum.

## Project Structure

```
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── Pages/         # React components for different pages
│   │   ├── App.js         # Main application component
│   │   └── index.js       # Application entry point
│   └── public/            # Static files
├── contracts/             # Smart contracts
├── test/                  # Test files
└── scripts/              # Deployment and utility scripts
```

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- MetaMask browser extension
- Git

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd Etherix2.0
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

3. Configure environment:
   - Create a `.env` file in the root directory
   - Add your environment variables (if any)

4. Start the development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Available Scripts

In the frontend directory, you can run:

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from create-react-app

## Features

- Connect/Disconnect MetaMask wallet
- Mint new NFT tickets
- Buy tickets from the marketplace
- Resell your tickets
- View your ticket collection
- Dashboard with ticket statistics

## Smart Contract Integration

The application interacts with the following smart contracts:
- TicketNFT.sol
- TicketMarketplace.sol

## Development

1. Frontend Development:
   - The application uses React 18
   - Styling is done with Tailwind CSS
   - Routing is handled by React Router v6

2. Smart Contract Development:
   - Contracts are written in Solidity
   - Use Hardhat for development and testing

## Troubleshooting

Common issues and solutions:

1. MetaMask Connection Issues:
   - Ensure MetaMask is installed and unlocked
   - Check if you're on the correct network
   - Clear browser cache if needed

2. Build Issues:
   - Delete node_modules and package-lock.json
   - Run `npm install` again
   - Ensure all dependencies are correctly installed

3. Contract Interaction Issues:
   - Verify contract addresses
   - Check network configuration
   - Ensure sufficient gas fees

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
