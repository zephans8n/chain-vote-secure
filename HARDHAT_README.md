
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

1. Write or modify smart contracts in `src/contracts/`
2. Write tests for your contracts in `test/`
3. Run tests with `npx hardhat test`
4. Deploy contracts to local network for testing
5. Update the contract address in your frontend code

### Contract Deployment

When deploying to a testnet or mainnet, update the `hardhat.config.js` file with your network configuration and private key:

```javascript
// Example network configuration (add this to hardhat.config.js)
networks: {
  hardhat: {
    chainId: 1337
  },
  goerli: {
    url: `https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID`,
    accounts: [`0x${YOUR_PRIVATE_KEY}`]
  }
}
```

Then deploy with:
```bash
npx hardhat run scripts/deploy.js --network goerli
```

### Interacting with Deployed Contracts

After deployment, update the `CONTRACT_ADDRESS` variable in `src/lib/contractUtils.ts` with the deployed contract address.
