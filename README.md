
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

- Node.js (v14+ recommended)
- npm or yarn
- MetaMask extension installed in your browser
- [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/) account for deploying to testnets/mainnet

## Environment Setup

1. **Create a `.env` file in the project root**
   
   Copy the `.env.example` file to `.env` and fill in your values:

```bash
cp .env.example .env
```

2. **Update the `.env` file with your credentials:**
   - Add your Alchemy/Infura API endpoints
   - Add your wallet private key (without 0x prefix)
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

## Deployment Process

### Step 1: Smart Contract Deployment

1. **Make sure your `.env` file is properly configured** with network endpoints and private key.

2. **Deploy to a testnet** (Goerli or Sepolia is recommended)

```bash
npx hardhat run scripts/deploy.js --network goerli
# OR
npx hardhat run scripts/deploy.js --network sepolia
```

3. **Verify contract on Etherscan** (optional but recommended)

```bash
npx hardhat verify --network goerli DEPLOYED_CONTRACT_ADDRESS
```

### Step 2: Frontend Deployment

1. **Build the frontend**

```bash
npm run build
```

2. **Deploy to your preferred hosting service**

- Netlify: Connect your GitHub repository and set the build command to `npm run build`
- Vercel: Import your project and it will automatically detect the build settings
- GitHub Pages: Push the build folder to a gh-pages branch
- AWS S3/CloudFront: Upload the build folder to an S3 bucket configured for static website hosting

### Step 3: Post-Deployment Verification

1. **Test the deployed application**
   - Verify you can connect your wallet
   - Create a test vote
   - Cast votes from different addresses
   - Check that results are displayed correctly

2. **Monitor smart contract usage**
   - Use [Etherscan](https://etherscan.io/) to monitor contract transactions
   - Set up alerts for any unusual activity

## Usage Guide

1. **Connect your Ethereum wallet** by clicking the "Connect Wallet" button
2. **Browse active votes** on the homepage or votes page
3. **Create a new vote** by clicking "Create Vote" and filling out the form
4. **Cast your vote** by selecting an option and confirming the transaction
5. **View results** after voting or after the vote has ended

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
