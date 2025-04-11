
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

async function main() {
  // Get the contract factory
  const VotingContract = await ethers.getContractFactory("VotingContract");
  
  // Deploy the contract
  console.log("Deploying VotingContract...");
  const votingContract = await VotingContract.deploy();
  
  // Wait for deployment to finish
  await votingContract.deployed();
  
  console.log("VotingContract deployed to:", votingContract.address);
  
  // Update the contract address in the .env file if it exists
  try {
    const envFilePath = path.join(__dirname, "../.env");
    if (fs.existsSync(envFilePath)) {
      let envContent = fs.readFileSync(envFilePath, "utf8");
      envContent = envContent.replace(
        /CONTRACT_ADDRESS=.*/,
        `CONTRACT_ADDRESS=${votingContract.address}`
      );
      fs.writeFileSync(envFilePath, envContent);
      console.log("Updated CONTRACT_ADDRESS in .env file");
    }
  } catch (error) {
    console.log("Could not update .env file:", error);
  }
  
  // Update the contract address in contractUtils.ts
  const contractUtilsPath = path.join(__dirname, "../src/lib/contractUtils.ts");
  
  // Check if the file exists before trying to update it
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
}

// Run the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });
