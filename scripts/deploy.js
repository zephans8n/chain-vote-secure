
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

async function main() {
  try {
    // Get the contract factory
    const VotingContract = await ethers.getContractFactory("VotingContract");
    
    // Deploy the contract
    console.log("Deploying VotingContract...");
    const votingContract = await VotingContract.deploy();
    
    // Wait for deployment to finish
    await votingContract.deployed();
    
    console.log("VotingContract deployed to:", votingContract.address);
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
    
    // Generate the ABI and update the contractUtils.ts file
    const artifactPath = path.join(__dirname, "../artifacts/contracts/VotingContract.sol/VotingContract.json");
    const contractArtifact = require(artifactPath);
    
    // Save the ABI to a separate file for frontend use
    const abiDir = path.join(__dirname, "../src/contracts");
    if (!fs.existsSync(abiDir)) {
      fs.mkdirSync(abiDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(abiDir, "VotingContractABI.json"),
      JSON.stringify(contractArtifact.abi, null, 2)
    );
    
    console.log("Contract ABI saved to src/contracts/VotingContractABI.json");
    
    // Update the contractUtils.ts file with the new contract address
    const contractUtilsPath = path.join(__dirname, "../src/lib/contractUtils.ts");
    
    if (fs.existsSync(contractUtilsPath)) {
      let contractUtils = fs.readFileSync(contractUtilsPath, "utf8");
      
      // Replace the contract address placeholder with the actual address
      contractUtils = contractUtils.replace(
        /const CONTRACT_ADDRESS = ['"].*['"]/,
        `const CONTRACT_ADDRESS = '${votingContract.address}'`
      );
      
      // Write the updated file
      fs.writeFileSync(contractUtilsPath, contractUtils);
      
      console.log(`Updated CONTRACT_ADDRESS in ${contractUtilsPath}`);
    } else {
      console.log(`Cannot find ${contractUtilsPath} to update contract address`);
      console.log(`Please manually update CONTRACT_ADDRESS in your frontend code with: ${votingContract.address}`);
    }

    console.log("\nDeployment completed successfully!");
    console.log("\nVerify your contract with:");
    console.log(`npx hardhat verify --network ${network.name} ${votingContract.address}`);
  } catch (error) {
    console.error("Error during deployment:", error);
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
