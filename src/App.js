// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { WagmiConfig, createConfig, configureChains, mainnet, sepolia } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import Home from './Pages/Home';
import BuyTicketPage from './Pages/BuyTicketPage';
import IssueTicket from './Pages/IssueTicket';
import MyticketPage from './Pages/MyticketPage';
import ResaleTicketPage from './Pages/ResaleTicketPage';
import './App.css';

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [mainnet, sepolia],
    [publicProvider()]
);

const config = createConfig({
    autoConnect: true,
    publicClient,
    webSocketPublicClient,
    connectors: [
        new MetaMaskConnector({ chains })
    ]
});

const clerkPubKey = "pk_test_Z3Jvd24tbW9ua2Zpc2gtMjkuY2xlcmsuYWNjb3VudHMuZGV2JA";

function App() {
    if (!clerkPubKey) {
        throw new Error("Missing Clerk Publishable Key");
    }

    return (
        <ClerkProvider publishableKey={clerkPubKey}>
            <WagmiConfig config={config}>
                <div className="min-h-screen bg-gray-100">
                    <Navbar />
                    <div className="container mx-auto px-4 py-8">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route
                                path="/buy-ticket"
                                element={
                                    <>
                                        <SignedIn>
                                            <BuyTicketPage />
                                        </SignedIn>
                                        <SignedOut>
                                            <RedirectToSignIn />
                                        </SignedOut>
                                    </>
                                }
                            />
                            <Route
                                path="/issue-ticket"
                                element={
                                    <>
                                        <SignedIn>
                                            <IssueTicket />
                                        </SignedIn>
                                        <SignedOut>
                                            <RedirectToSignIn />
                                        </SignedOut>
                                    </>
                                }
                            />
                            <Route
                                path="/my-tickets"
                                element={
                                    <>
                                        <SignedIn>
                                            <MyticketPage />
                                        </SignedIn>
                                        <SignedOut>
                                            <RedirectToSignIn />
                                        </SignedOut>
                                    </>
                                }
                            />
                            <Route
                                path="/resale-ticket"
                                element={
                                    <>
                                        <SignedIn>
                                            <ResaleTicketPage />
                                        </SignedIn>
                                        <SignedOut>
                                            <RedirectToSignIn />
                                        </SignedOut>
                                    </>
                                }
                            />
                        </Routes>
                    </div>
                </div>
            </WagmiConfig>
        </ClerkProvider>
    );
}

export default App; 