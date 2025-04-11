
const { ethers } = require("hardhat");

async function main() {
  // Get the contract factory
  const VotingContract = await ethers.getContractFactory("VotingContract");
  
  // Deploy the contract
  console.log("Deploying VotingContract...");
  const votingContract = await VotingContract.deploy();
  
  // Wait for deployment to finish
  await votingContract.deployed();
  
  console.log("VotingContract deployed to:", votingContract.address);
  
  // You can save this address to your frontend configuration
  console.log("Update CONTRACT_ADDRESS in src/lib/contractUtils.ts with this address");
}

// Run the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });
