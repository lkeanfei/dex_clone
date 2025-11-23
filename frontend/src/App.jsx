import React, { useState } from 'react';
import WalletConnect from './components/WalletConnect';
import Swap from './components/Swap';
import './App.css';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Crypto.com DEX Clone</h1>
        <WalletConnect
          setProvider={setProvider}
          setSigner={setSigner}
          setAccount={setAccount}
        />
      </header>
      <main>
        <Swap provider={provider} signer={signer} account={account} />
      </main>
    </div>
  );
}

export default App;
