import React from 'react';
import BlockchainBackground from './BlockchainBackground';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <BlockchainBackground>
            <Navbar />
            {children}
        </BlockchainBackground>
    );
};

export default Layout;
