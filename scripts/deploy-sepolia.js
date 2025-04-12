
const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

async function main() {
  try {
    // Check if we're on Sepolia network
    if (network.name !== 'sepolia') {
      console.warn("\x1b[33m%s\x1b[0m", "Warning: You're not deploying to Sepolia network!");
      console.log(`Current network: ${network.name}`);
      
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise(resolve => {
        readline.question('Do you want to continue? (y/N): ', resolve);
      });
      
      readline.close();
      
      if (answer.toLowerCase() !== 'y') {
        console.log("Deployment cancelled");
        process.exit(0);
      }
    }

    // Get the contract factory
    const VotingContract = await ethers.getContractFactory("VotingContract");
    
    // Deploy the contract
    console.log("\n\x1b[36m%s\x1b[0m", "Deploying VotingContract to " + network.name + "...");
    const votingContract = await VotingContract.deploy();
    
    // Wait for deployment to finish
    await votingContract.deployed();
    
    console.log("\x1b[32m%s\x1b[0m", "VotingContract deployed to:", votingContract.address);
    console.log("Transaction hash:", votingContract.deployTransaction.hash);
    
    // Update the contract address in the .env file if it exists
    try {
      const envFilePath = path.join(__dirname, "../.env");
      if (fs.existsSync(envFilePath)) {
        let envContent = fs.readFileSync(envFilePath, "utf8");
        
        if (envContent.includes("CONTRACT_ADDRESS=")) {
          // Replace existing CONTRACT_ADDRESS
          envContent = envContent.replace(
            /CONTRACT_ADDRESS=.*/,
            `CONTRACT_ADDRESS=${votingContract.address}`
          );
        } else {
          // Add CONTRACT_ADDRESS if it doesn't exist
          envContent += `\nCONTRACT_ADDRESS=${votingContract.address}`;
        }
        
        fs.writeFileSync(envFilePath, envContent);
        console.log("Updated CONTRACT_ADDRESS in .env file");
      }
    } catch (error) {
      console.log("Could not update .env file:", error);
    }
    
    // Generate the ABI file from the artifact
    const artifactPath = path.join(__dirname, "../artifacts/contracts/VotingContract.sol/VotingContract.json");
    const contractArtifact = require(artifactPath);
    
    // Update the frontend's contract utils with the new ABI and address
    try {
      const contractUtilsPath = path.join(__dirname, "../src/lib/contractUtils.ts");
      
      if (fs.existsSync(contractUtilsPath)) {
        let contractUtils = fs.readFileSync(contractUtilsPath, "utf8");
        
        // Replace the contract address placeholder
        contractUtils = contractUtils.replace(
          /const CONTRACT_ADDRESS = ['"].*['"]/,
          `const CONTRACT_ADDRESS = '${votingContract.address}'`
        );
        
        // Replace the ABI placeholder
        contractUtils = contractUtils.replace(
          /const CONTRACT_ABI = \[\] as any;/,
          `const CONTRACT_ABI = ${JSON.stringify(contractArtifact.abi, null, 2)} as any;`
        );
        
        // Write the updated file
        fs.writeFileSync(contractUtilsPath, contractUtils);
        
        console.log(`Updated CONTRACT_ADDRESS and ABI in ${contractUtilsPath}`);
      }
    } catch (error) {
      console.log("Could not update contractUtils.ts:", error);
    }

    console.log("\n\x1b[32m%s\x1b[0m", "Deployment completed successfully!");
    console.log("\nVerify your contract with:");
    console.log(`npx hardhat verify --network ${network.name} ${votingContract.address}`);
    
    // Add Sepolia-specific instructions
    if (network.name === 'sepolia') {
      console.log("\nView your contract on Sepolia Etherscan:");
      console.log(`https://sepolia.etherscan.io/address/${votingContract.address}`);
      console.log("\nRemember to fund your wallet with Sepolia ETH from:");
      console.log("https://sepolia-faucet.pk910.de/");
    }
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "Error during deployment:", error);
    process.exit(1);
  }
}

// Run the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });
