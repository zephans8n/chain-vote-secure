
# ChainVote - Blockchain Voting Application

ChainVote is a decentralized voting application built on Ethereum that allows users to create and participate in transparent, tamper-proof voting processes.

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
- [Infura](https://infura.io/) account for testnet and mainnet connections
- Hardhat for smart contract development and deployment (in a separate project)

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
   - Add your Infura API endpoints (especially for Sepolia)
   - After deployment, update CONTRACT_ADDRESS with your deployed contract address

## Development Setup

1. **Install dependencies**

```bash
npm install
```

2. **Deploy your smart contract using Hardhat** (in a separate project)

After deploying your contract:

- Update the CONTRACT_ADDRESS in your `.env` file
- Copy your contract ABI to the project
- Update the reference to the ABI in `src/lib/contractUtils.ts`

3. **Start the frontend development server**

```bash
npm run dev
```

## Using with different networks

### Sepolia Testnet

1. Make sure you have deployed your contract to Sepolia
2. Update your `.env` file with the contract address
3. Make sure to connect MetaMask to Sepolia network when testing
4. Get test ETH from the [Sepolia faucet](https://sepolia-faucet.pk910.de/)

## License

This project is licensed under the MIT License.
