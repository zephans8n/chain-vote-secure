
# Smart Contract Requirements for ChainVote

This document outlines the requirements for the VotingContract smart contract that needs to be implemented for the ChainVote application.

## Core Data Structures

### Vote
```solidity
struct Vote {
    uint256 id;
    string title;
    string description;
    address creator;
    uint256 startTime;  // Unix timestamp
    uint256 endTime;    // Unix timestamp
    bool isActive;      // Flag to indicate if the vote is active
    uint256 totalVotes; // Total votes cast
}
```

### Option
```solidity
struct Option {
    uint256 id;
    string text;
    uint256 voteCount;
}
```

## Storage Variables

The contract should maintain:

1. A mapping of vote ID to Vote struct
2. A mapping of vote ID to an array of Option structs
3. A mapping to track if an address has already voted in a specific vote
4. A counter for the total number of votes created

## Required Functions

### Vote Creation

```solidity
function createVote(
    string memory _title,
    string memory _description,
    string[] memory _options,
    uint256 _startTime,
    uint256 _endTime
) public returns (uint256)
```

Requirements:
- Must provide at least 2 options
- End time must be after start time
- Should emit a VoteCreated event with voteId, title, and creator address
- Should return the ID of the created vote

### Vote Casting

```solidity
function castVote(uint256 _voteId, uint256 _optionId) public
```

Requirements:
- Vote must exist
- Vote must be active
- Current time must be between start and end time
- User must not have already voted in this vote
- Option ID must be valid
- Should emit a VoteCast event with voteId, optionId, and voter address

### Vote Queries

```solidity
function getVoteDetails(uint256 _voteId) public view returns (
    string memory title,
    string memory description,
    address creator,
    uint256 startTime,
    uint256 endTime,
    bool isActive,
    uint256 totalVotes
)
```

```solidity
function getVoteOptionsCount(uint256 _voteId) public view returns (uint256)
```

```solidity
function getVoteOption(uint256 _voteId, uint256 _optionId) public view returns (
    string memory text,
    uint256 voteCount
)
```

```solidity
function getActiveVoteIds() public view returns (uint256[] memory)
```

Requirements:
- All query functions should validate inputs
- getActiveVoteIds should only return votes where isActive is true and current time is before end time

## Events

```solidity
event VoteCreated(uint256 indexed voteId, string title, address indexed creator);
event VoteCast(uint256 indexed voteId, uint256 optionId, address indexed voter);
```

## Security Considerations

1. No reentrancy vulnerabilities
2. Proper input validation
3. Checks for valid vote IDs and option IDs
4. Prevent double voting
5. Consider gas optimization for large votes with many options

## Interface Requirements

The smart contract should implement these functions exactly as specified to ensure compatibility with the frontend application. Any changes to function signatures will require corresponding updates to the frontend code.

## Testing Requirements

The contract should be thoroughly tested with unit tests covering:
1. Vote creation with valid and invalid inputs
2. Vote casting with valid and invalid inputs
3. Edge cases (e.g., voting exactly at start time or end time)
4. Voting state queries

## Deployment

The contract should be compatible with Solidity 0.8.0 or later and deployable to Ethereum mainnet and testnets.
