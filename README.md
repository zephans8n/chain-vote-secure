
# Decentralized Voting Application

A decentralized voting application built with React and Ethereum smart contracts.

## Features

- Create and manage votes on the blockchain
- Connect with MetaMask wallet
- View active votes and their details
- Cast votes securely
- Real-time vote statistics and graphs

## Smart Contract Deployment

1. Open [Remix IDE](https://remix.ethereum.org)
2. Create a new file called `VotingContract.sol` and copy the contract code from the `contracts/VotingContract.sol` file in this project
3. Compile the contract using Solidity Compiler (0.8.19 or compatible)
4. Deploy the contract to your chosen network:
   - For testing: Use Sepolia, Goerli, or other testnet
   - For production: Use Ethereum Mainnet or other EVM-compatible network
5. Copy the deployed contract address
6. In this project, update `CONTRACT_ADDRESS` in `src/lib/contractUtils.ts` with your deployed contract address

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Connect your MetaMask wallet and interact with the dApp

## Usage Flow

1. Connect Wallet
   - Click "Connect Wallet" in the navigation bar
   - Approve the MetaMask connection

2. View Votes
   - Browse active votes on the homepage
   - Click on a vote to see its details

3. Create Vote
   - Navigate to "Create Vote"
   - Fill in title, description, and options
   - Set start and end dates
   - Submit transaction via MetaMask

4. Cast Vote
   - Open a vote's details
   - Select an option
   - Confirm transaction in MetaMask

5. View Results
   - See real-time voting results
   - View graphical representation of votes
   - Check voting statistics

## Network Support

This dApp supports any EVM-compatible network. Make sure to:
1. Deploy the contract to your chosen network
2. Update the contract address in `src/lib/contractUtils.ts`
3. Configure MetaMask for the correct network

## Testing Without MetaMask

The application includes a mock mode that allows for testing without connecting to an actual blockchain:
- All blockchain operations will display simulated success messages
- Mock data will be shown for votes and voting results
- This allows for UI/UX testing without requiring actual MetaMask transactions

## Contract Code

The smart contract can be found in `contracts/VotingContract.sol`. It includes features for:
- Creating votes with multiple options
- Casting votes securely
- Tracking vote participation and results
- Managing vote start/end times
