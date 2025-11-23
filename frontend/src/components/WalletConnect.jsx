import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletConnect = ({ setProvider, setSigner, setAccount }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [currentAccount, setCurrentAccount] = useState('');

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await provider.send("eth_requestAccounts", []);
                const signer = await provider.getSigner();

                setProvider(provider);
                setSigner(signer);
                setAccount(accounts[0]);
                setCurrentAccount(accounts[0]);
                setIsConnected(true);
            } catch (error) {
                console.error("Error connecting wallet:", error);
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    return (
        <div className="wallet-connect">
            {!isConnected ? (
                <button onClick={connectWallet} className="btn-connect">
                    Connect Wallet
                </button>
            ) : (
                <p>Connected: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}</p>
            )}
        </div>
    );
};

export default WalletConnect;
