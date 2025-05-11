import React from 'react';
import { Link } from 'react-router-dom';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
    const { address, isConnected } = useAccount();
    const { connect } = useConnect({
        connector: new MetaMaskConnector(),
    });
    const { disconnect } = useDisconnect();

    return (
        <nav className="bg-gray-900 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="border border-spacing-1 font-bold text-purple-400" style={{ fontSize: '100px' }}>
                        Etherix
                    </Link>
                    <div className="flex items-center space-x-4">
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                                    Sign In
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                                    Sign Up
                                </button>
                            </SignUpButton>
                        </SignedOut>

                        {isConnected ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-400">
                                    {address?.slice(0, 6)}...{address?.slice(-4)}
                                </span>
                                <button
                                    onClick={() => disconnect()}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                >
                                    Disconnect
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => connect()}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                            >
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 