
# ChainVote - Blockchain Voting Application

ChainVote is a decentralized voting application built on Ethereum that allows users to create and participate in transparent, tamper-proof voting processes.

## Project Structure

The project is organized into two main components:

- **Frontend**: React application with TypeScript that provides the user interface
- **Backend**: Solidity smart contracts that handle the voting logic on the blockchain

```
📦 ChainVote
 ┣ 📂 src
 ┃ ┣ 📂 backend
 ┃ ┃ ┣ 📂 contracts       # Solidity smart contracts
 ┃ ┃ ┗ 📂 artifacts       # Compiled contract artifacts
 ┃ ┣ 📂 frontend
 ┃ ┃ ┣ 📂 context         # React context providers
 ┃ ┃ ┣ 📂 lib             # Utility functions for blockchain interaction
 ┃ ┣ 📂 components        # React components
 ┃ ┣ 📂 hooks             # Custom React hooks
 ┃ ┣ 📂 pages             # Page components
 ┃ ┗ 📜 App.tsx           # Main application component
 ┣ 📂 scripts             # Deployment and utility scripts
 ┣ 📂 test                # Smart contract tests
 ┣ 📜 hardhat.config.js   # Hardhat configuration
 ┗ 📜 README.md           # Project documentation
```

## Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- MetaMask extension installed in your browser
- [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/) account for deploying to testnets/mainnet

## Development Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd chainvote
```

2. **Install dependencies**

```bash
npm install
```

3. **Compile smart contracts**

```bash
npx hardhat compile
```

4. **Run smart contract tests**

```bash
npx hardhat test
```

5. **Start local blockchain**

```bash
npx hardhat node
```

6. **Deploy contracts to local blockchain** (in a new terminal)

```bash
npx hardhat run scripts/deploy.js --network localhost
```

7. **Start the frontend development server**

```bash
npm run dev
```

## Deployment Process

### Step 1: Smart Contract Deployment

1. **Create a `.env` file in the project root** with the following content:

```
PRIVATE_KEY=your_ethereum_private_key_without_0x_prefix
GOERLI_URL=your_alchemy_or_infura_goerli_endpoint
SEPOLIA_URL=your_alchemy_or_infura_sepolia_endpoint
MAINNET_URL=your_alchemy_or_infura_mainnet_endpoint
```

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

## Local Development with Hardhat

For more details on using Hardhat for local development and testing, refer to [HARDHAT_README.md](./HARDHAT_README.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
