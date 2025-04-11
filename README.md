
# ChainVote - Blockchain Voting Application

ChainVote is a decentralized voting application built on Ethereum that allows users to create and participate in transparent, tamper-proof voting processes.

## Project Structure

The project is organized into two main components:

- **Frontend**: React application with TypeScript that provides the user interface
- **Backend**: Solidity smart contracts that handle the voting logic on the blockchain

```
📦 ChainVote
 ┣ 📂 contracts         # Solidity smart contracts
 ┣ 📂 scripts           # Deployment and utility scripts
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
- [Infura](https://infura.io/) account for deploying to Sepolia testnet

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
   - Don't worry about CONTRACT_ADDRESS, it will be filled automatically during deployment

## Development Setup

1. **Install dependencies**

```bash
npm install
```

2. **Compile smart contracts**

```bash
npx hardhat compile
```

3. **Run smart contract tests**

```bash
npx hardhat test
```

4. **Start local blockchain**

```bash
npx hardhat node
```

5. **Deploy contracts to local blockchain** (in a new terminal)

```bash
npx hardhat run scripts/deploy.js --network localhost
```

6. **Start the frontend development server**

```bash
npm run dev
```

## Deployment to Sepolia Testnet

### Step 1: Smart Contract Deployment to Sepolia

1. **Make sure your `.env` file is properly configured**:
   - `SEPOLIA_URL` should be your Infura Sepolia endpoint (https://sepolia.infura.io/v3/your-project-id)
   - `PRIVATE_KEY` should be your wallet private key (without 0x prefix)
   - `ETHERSCAN_API_KEY` should be your Etherscan API key

2. **Deploy to Sepolia testnet**:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

3. **Verify contract on Etherscan**:

```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

### Step 2: Testing on Sepolia

1. **Get test ETH** from the [Sepolia faucet](https://sepolia-faucet.pk910.de/)

2. **Test your application with MetaMask**:
   - Add the Sepolia network to MetaMask if not already added
   - Connect your application to the Sepolia network
   - Create and cast votes to ensure everything works correctly

3. **Monitor your contract** on [Sepolia Etherscan](https://sepolia.etherscan.io/)

### Step 3: Frontend Deployment

1. **Build the frontend**:

```bash
npm run build
```

2. **Deploy to your preferred hosting service** (Netlify, Vercel, etc.)

## Additional Hardhat Commands

```bash
# Get Sepolia network info
npx hardhat network --network sepolia

# Get account balances on Sepolia
npx hardhat accounts --network sepolia

# Generate TypeScript types from ABI
npx hardhat typechain

# Get help with Hardhat
npx hardhat help
```

## Optimization Tips

- **Gas Optimization**: The contract has been designed with gas efficiency in mind
- **Security**: Basic security practices have been implemented, but consider a professional audit before mainnet deployment
- **Sepolia Testnet**: Ideal for testing before moving to mainnet

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
