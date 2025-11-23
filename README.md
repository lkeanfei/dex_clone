# Crypto.com DEX Clone

A decentralized exchange (DEX) clone inspired by Crypto.com and Uniswap V2, built for educational purposes. This project implements a constant product Automated Market Maker (AMM) on an EVM-compatible chain.

## Features

- **AMM Model**: Uses the Constant Product Formula ($x * y = k$) for automated liquidity provision.
- **Token Swapping**: Users can swap between ERC-20 tokens.
- **Liquidity Provision**: Users can mint LP tokens by depositing token pairs (Phase 1 MVP).
- **Fees**: 0.3% swap fee distributed to liquidity providers.

## Tech Stack

- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin
- **Frontend**: React, Vite, Ethers.js
- **Testing**: Chai, Mocha

## Project Structure

```
dex_clone/
├── contracts/      # Hardhat project for smart contracts
│   ├── contracts/  # Solidity source files (DEXPair, MockToken)
│   ├── scripts/    # Deployment and helper scripts
│   └── test/       # Unit tests
└── frontend/       # React web application
    └── src/        # Frontend source code
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MetaMask Wallet

### Installation

1.  **Clone the repository** (if applicable) and navigate to the project:
    ```bash
    cd dex_clone
    ```

2.  **Install Contract Dependencies**:
    ```bash
    cd contracts
    npm install
    ```

3.  **Install Frontend Dependencies**:
    ```bash
    cd ../frontend
    npm install
    ```

## Usage

### 1. Start Local Blockchain
Start a local Hardhat node to deploy contracts and test locally.
```bash
cd contracts
npx hardhat node
```

### 2. Deploy Contracts
In a new terminal, deploy the contracts to the local network. This script also generates mock tokens and saves the addresses for the frontend.
```bash
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```

### 3. Run Frontend
Start the React development server.
```bash
cd frontend
npm run dev
```
Access the app at `http://localhost:5173`.

### 4. Connect MetaMask
- Configure MetaMask to connect to `Localhost 8545` (Chain ID: 31337).
- Import a test account using a private key from the `npx hardhat node` output.

## Roadmap

- [x] **Phase 1**: MVP - Core Swap Engine (Pair Contract, Basic UI)
- [ ] **Phase 2**: Factory/Router Contracts, Liquidity Management UI
- [ ] **Phase 3**: Advanced Features (Slippage, Price Oracle)
- [ ] **Phase 4**: Governance & Security

## License

MIT
