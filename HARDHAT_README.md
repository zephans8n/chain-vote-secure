
# Hardhat Testing Framework for ChainVote

This project uses Hardhat for testing and deploying Solidity smart contracts.

## Getting Started

### Install Dependencies
The dependencies should be installed already when you installed the project.

### Available Commands

#### Compile Contracts
```bash
npx hardhat compile
```

#### Run Tests
```bash
npx hardhat test
```

#### Deploy Contract (to local network)
```bash
npx hardhat run scripts/deploy.js --network localhost
```

#### Start Local Blockchain
```bash
npx hardhat node
```

### Development Workflow

1. Write or modify smart contracts in `src/backend/contracts/`
2. Write tests for your contracts in `test/`
3. Run tests with `npx hardhat test`
4. Deploy contracts to local network for testing
5. Update the contract address in your frontend code

### Contract Deployment

When deploying to a testnet or mainnet, update the `.env` file with your network configuration and private key:

```
PRIVATE_KEY=your_ethereum_private_key_without_0x_prefix
GOERLI_URL=your_alchemy_or_infura_goerli_endpoint
SEPOLIA_URL=your_alchemy_or_infura_sepolia_endpoint
MAINNET_URL=your_alchemy_or_infura_mainnet_endpoint
```

Then deploy with:
```bash
npx hardhat run scripts/deploy.js --network goerli
```

### Interacting with Deployed Contracts

After deployment, the deploy script will automatically update the `CONTRACT_ADDRESS` variable in `src/frontend/lib/contractUtils.ts` with the deployed contract address.

### Gas Optimization

To optimize gas usage in your contracts:

1. Use calldata instead of memory for function parameters that don't change
2. Pack variables efficiently (using uint8, uint16 where appropriate)
3. Use events to store data that doesn't need on-chain access
4. Consider batch operations for multiple transactions

### Security Best Practices

1. Always use the latest Solidity version
2. Add proper access control to sensitive functions
3. Implement reentrancy guards for external calls
4. Validate all inputs thoroughly
5. Consider having your contract audited before mainnet deployment
