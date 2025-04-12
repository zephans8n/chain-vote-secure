
# ChainVote - Blockchain Voting Application

ChainVote is a decentralized voting application built on Ethereum that allows users to create and participate in transparent, tamper-proof voting processes on the Sepolia testnet.

## Project Structure

The project is a React frontend application designed to interact with a voting smart contract:

```
📦 ChainVote
 ┣ 📂 src               # Frontend source code
 ┃ ┣ 📂 components      # React components
 ┃ ┣ 📂 hooks           # Custom React hooks
 ┃ ┣ 📂 lib             # Utility functions for blockchain interaction
 ┃ ┣ 📂 pages           # Page components
 ┃ ┗ 📜 App.tsx         # Main application component
 ┗ 📜 README.md         # Project documentation
```

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MetaMask extension installed in your browser
- [Infura](https://infura.io/) account for Sepolia testnet connection
- Hardhat for smart contract deployment and verification

## Required Smart Contract Interface

Your smart contract should implement the following functions:

1. **Vote Creation**:
   - `createVote(string title, string description, string[] options, uint256 startTime, uint256 endTime)`
   - Creates a new vote with the given details

2. **Vote Casting**:
   - `castVote(uint256 voteId, uint256 optionId)`
   - Allows a user to cast a vote for a specific option

3. **Vote Queries**:
   - `getActiveVoteIds()` - Returns IDs of all active votes
   - `getVoteDetails(uint256 voteId)` - Returns details of a specific vote
   - `getVoteOptionsCount(uint256 voteId)` - Returns the number of options in a vote
   - `getVoteOption(uint256 voteId, uint256 optionId)` - Returns details of a specific option
   - `hasVoted(uint256 voteId, address voter)` - Checks if an address has voted

4. **Events**:
   - `VoteCreated(uint256 indexed voteId, address indexed creator)`
   - `VoteCast(uint256 indexed voteId, uint256 optionId, address indexed voter)`

## Environment Setup

1. **Create a `.env` file in the project root**
   
   Copy the `.env.example` file to `.env` and fill in your values:

```bash
cp .env.example .env
```

2. **Update the `.env` file with your credentials:**
   - Add your Infura API endpoint for Sepolia
   - Add your wallet private key for deployment
   - Add your Etherscan API key for contract verification
   - After deployment, update CONTRACT_ADDRESS with your deployed contract address

## Deployment Steps

1. **Install dependencies**

```bash
npm install
```

2. **Deploy your smart contract to Sepolia**

```bash
npx hardhat run scripts/deploy-sepolia.js --network sepolia
```

This will:
- Deploy the contract to Sepolia network
- Update your `.env` file with the deployed contract address
- Update the contract ABI in your frontend code

3. **Verify the contract on Etherscan**

```bash
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS
```

4. **Start the frontend development server**

```bash
npm run dev
```

## Using the Sepolia Testnet

1. Make sure you have deployed your contract to Sepolia
2. Update your `.env` file with the contract address
3. Make sure to connect MetaMask to Sepolia network when testing
4. Get test ETH from the [Sepolia faucet](https://sepolia-faucet.pk910.de/)

## License

This project is licensed under the MIT License.
