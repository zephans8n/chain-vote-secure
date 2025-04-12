
# ChainVote - Blockchain Voting Application

ChainVote is a decentralized voting application built on Ethereum that allows users to create and participate in transparent, tamper-proof voting processes.

## Project Structure

The project is structured as a React frontend application that integrates with a smart contract on Ethereum:

```
📦 ChainVote
 ┣ 📂 contracts         # Solidity smart contract (deployed separately)
 ┣ 📂 scripts           # Deployment scripts for Hardhat
 ┣ 📂 test              # Smart contract tests
 ┣ 📂 src               # Frontend source code
 ┃ ┣ 📂 components      # React components
 ┃ ┣ 📂 hooks           # Custom React hooks
 ┃ ┣ 📂 lib             # Utility functions for blockchain interaction
 ┃ ┣ 📂 pages           # Page components
 ┃ ┗ 📜 App.tsx         # Main application component
 ┣ 📜 hardhat.config.js # Hardhat configuration
 ┗ 📜 README.md         # Project documentation
```

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MetaMask extension installed in your browser
- [Infura](https://infura.io/) account for testnet and mainnet connections

## Smart Contract Requirements

The ChainVote smart contract needs to implement the following functionality:

1. **Vote Creation**:
   - Create new votes with title, description, options, start time, and end time
   - Require at least 2 voting options
   - Store creator address

2. **Vote Casting**:
   - Allow users to cast votes for specific options
   - Prevent double voting
   - Check vote timing (can't vote before start time or after end time)

3. **Vote Querying**:
   - Get vote details (title, description, creator, timing, status)
   - Get vote options and results
   - Get list of active votes

4. **Events**:
   - Emit events when votes are created
   - Emit events when votes are cast

For detailed interface requirements, see `SMART_CONTRACT_REQUIREMENTS.md`

## Environment Setup

1. **Create a `.env` file in the project root**
   
   Copy the `.env.example` file to `.env` and fill in your values:

```bash
cp .env.example .env
```

2. **Update the `.env` file with your credentials:**
   - Add your Infura API endpoints (especially for Sepolia)
   - Add your wallet private key (without 0x prefix)
   - Add your Etherscan API key for contract verification
   - After deployment, update CONTRACT_ADDRESS with your deployed contract address

## Development Setup

1. **Install dependencies**

```bash
npm install
```

2. **Deploy your smart contract using Hardhat**

Use separate terminal/command prompt to deploy your contract:

```bash
# Compile smart contracts
npx hardhat compile

# Run smart contract tests
npx hardhat test

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy-sepolia.js --network sepolia
```

3. **Update the contract address**

After deployment, update your `.env` file with the contract address.

4. **Start the frontend development server**

```bash
npm run dev
```

## Using with different networks

### Sepolia Testnet

1. **Deploy to Sepolia testnet**:

```bash
npx hardhat run scripts/deploy-sepolia.js --network sepolia
```

2. **Verify contract on Etherscan**:

```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

3. **Get test ETH** from the [Sepolia faucet](https://sepolia-faucet.pk910.de/)

4. Make sure to connect MetaMask to Sepolia network when testing

## Frontend Development

The frontend is a React application that interacts with the deployed smart contract. To develop the frontend:

1. Make sure the contract is deployed and the address is updated in your environment
2. Connect MetaMask wallet to interact with the contract
3. Use the provided utility functions in `src/lib/web3.ts` to interact with the contract

## License

This project is licensed under the MIT License.
