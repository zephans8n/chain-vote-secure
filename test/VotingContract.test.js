
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingContract", function () {
  let votingContract;
  let owner;
  let addr1;
  let addr2;
  
  // Start time is now, end time is 1 week from now
  const startTime = Math.floor(Date.now() / 1000);
  const endTime = startTime + 7 * 24 * 60 * 60;

  beforeEach(async function () {
    // Get the contract factory and signers
    const VotingContract = await ethers.getContractFactory("VotingContract");
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    votingContract = await VotingContract.deploy();
    await votingContract.deployed();
  });

  describe("Vote Creation", function () {
    it("Should create a new vote", async function () {
      const title = "Test Vote";
      const description = "This is a test vote";
      const options = ["Option 1", "Option 2", "Option 3"];

      await expect(votingContract.createVote(
        title,
        description,
        options,
        startTime,
        endTime
      ))
        .to.emit(votingContract, "VoteCreated")
        .withArgs(0, title, owner.address);

      // Check that vote exists
      const voteDetails = await votingContract.getVoteDetails(0);
      expect(voteDetails.title).to.equal(title);
      expect(voteDetails.description).to.equal(description);
      expect(voteDetails.creator).to.equal(owner.address);
      expect(voteDetails.isActive).to.equal(true);
    });

    it("Should not allow creating votes with less than 2 options", async function () {
      await expect(votingContract.createVote(
        "Test Vote",
        "Description",
        ["Option 1"],
        startTime,
        endTime
      )).to.be.revertedWith("Must provide at least 2 options");
    });

    it("Should not allow end time before start time", async function () {
      await expect(votingContract.createVote(
        "Test Vote",
        "Description",
        ["Option 1", "Option 2"],
        endTime, // swapping times to cause error
        startTime
      )).to.be.revertedWith("End time must be after start time");
    });
  });

  describe("Vote Casting", function () {
    beforeEach(async function () {
      // Create a vote first
      await votingContract.createVote(
        "Test Vote",
        "This is a test vote",
        ["Option 1", "Option 2", "Option 3"],
        startTime,
        endTime
      );
    });

    it("Should allow a user to cast a vote", async function () {
      await expect(votingContract.connect(addr1).castVote(0, 1))
        .to.emit(votingContract, "VoteCast")
        .withArgs(0, 1, addr1.address);

      // Check that vote was counted
      const option = await votingContract.getVoteOption(0, 1);
      expect(option.voteCount).to.equal(1);
    });

    it("Should not allow voting twice", async function () {
      await votingContract.connect(addr1).castVote(0, 1);
      await expect(votingContract.connect(addr1).castVote(0, 2))
        .to.be.revertedWith("Already voted");
    });

    it("Should not allow voting for non-existent options", async function () {
      await expect(votingContract.connect(addr1).castVote(0, 99))
        .to.be.revertedWith("Invalid option");
    });
  });

  describe("Vote Queries", function () {
    beforeEach(async function () {
      // Create active votes
      await votingContract.createVote(
        "Active Vote 1",
        "Description 1",
        ["Option 1", "Option 2"],
        startTime,
        endTime
      );
      
      await votingContract.createVote(
        "Active Vote 2",
        "Description 2",
        ["Option A", "Option B", "Option C"],
        startTime,
        endTime
      );
    });

    it("Should return the correct number of active votes", async function () {
      const activeVotes = await votingContract.getActiveVoteIds();
      expect(activeVotes.length).to.equal(2);
    });

    it("Should return correct vote options count", async function () {
      const count1 = await votingContract.getVoteOptionsCount(0);
      const count2 = await votingContract.getVoteOptionsCount(1);
      
      expect(count1).to.equal(2);
      expect(count2).to.equal(3);
    });
  });
});
