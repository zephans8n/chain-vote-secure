
# Blockchain Voting Platform

A decentralized application for creating and participating in transparent, secure blockchain-based votes.

## Features

- **Wallet Integration**: Connect with MetaMask for secure authentication
- **Vote Creation**: Create new votes with custom options, titles, and descriptions
- **Vote Participation**: Cast votes on active proposals securely on-chain
- **Result Tracking**: View real-time voting results with visual charts
- **Mobile Responsive**: Full functionality on both desktop and mobile devices

## Technology Stack

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui
- **Blockchain**: Ethereum (with support for multiple networks)
- **Smart Contract**: Solidity
- **Development**: Hardhat (for contract deployment and testing)

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MetaMask browser extension

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/blockchain-voting-platform.git
cd blockchain-voting-platform
```

2. Install dependencies:
```
npm install
# or
yarn install
```

3. Start the development server:
```
npm run dev
# or
yarn dev
```

### Smart Contract Deployment

1. Configure your `.env` file with your private key and network URL
2. Deploy the contract:
```
npx hardhat run scripts/deploy-sepolia.js --network sepolia
```
3. Update the contract address in `src/lib/contractUtils.ts`

## How It Works

### Voting Flow

1. **Connect Wallet**: Users connect their MetaMask wallet to authenticate
2. **Browse Votes**: View active and upcoming votes on the platform
3. **Vote Creation**: Authorized users can create new votes
4. **Participate**: Cast votes on active proposals
5. **Results**: View real-time results as votes are cast on the blockchain

### Smart Contract Architecture

- `VotingContract.sol`: Main contract handling vote creation, participation, and results
- Each vote has an ID, title, description, options, and timeframe
- Votes are stored on-chain with transparent tracking of options and vote counts
- Security measures prevent double-voting and ensure vote integrity

## Development Mode

For development without a blockchain connection, the application includes mock data and contract interactions, making it easy to develop and test functionality.

## License

MIT License

## Acknowledgments

- shadcn/ui for the component library
- Ethers.js for blockchain interaction
- Hardhat for smart contract development and testing
