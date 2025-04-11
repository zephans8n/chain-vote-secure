
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingContract {
    struct Vote {
        uint256 id;
        string title;
        string description;
        address creator;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        uint256 totalVotes;
    }

    struct Option {
        uint256 id;
        string text;
        uint256 voteCount;
    }

    mapping(uint256 => Vote) public votes;
    mapping(uint256 => Option[]) public voteOptions;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    
    uint256 public voteCount = 0;
    
    event VoteCreated(uint256 indexed voteId, string title, address indexed creator);
    event VoteCast(uint256 indexed voteId, uint256 optionId, address indexed voter);

    function createVote(
        string memory _title,
        string memory _description,
        string[] memory _options,
        uint256 _startTime,
        uint256 _endTime
    ) public returns (uint256) {
        require(_options.length >= 2, "Must provide at least 2 options");
        require(_endTime > _startTime, "End time must be after start time");
        
        uint256 voteId = voteCount++;
        
        votes[voteId] = Vote({
            id: voteId,
            title: _title,
            description: _description,
            creator: msg.sender,
            startTime: _startTime,
            endTime: _endTime,
            isActive: true,
            totalVotes: 0
        });
        
        for (uint256 i = 0; i < _options.length; i++) {
            voteOptions[voteId].push(Option({
                id: i,
                text: _options[i],
                voteCount: 0
            }));
        }
        
        emit VoteCreated(voteId, _title, msg.sender);
        return voteId;
    }
    
    function castVote(uint256 _voteId, uint256 _optionId) public {
        require(_voteId < voteCount, "Vote does not exist");
        require(votes[_voteId].isActive, "Vote is not active");
        require(block.timestamp >= votes[_voteId].startTime, "Voting has not started yet");
        require(block.timestamp <= votes[_voteId].endTime, "Voting has ended");
        require(!hasVoted[_voteId][msg.sender], "Already voted");
        require(_optionId < voteOptions[_voteId].length, "Invalid option");
        
        voteOptions[_voteId][_optionId].voteCount++;
        votes[_voteId].totalVotes++;
        hasVoted[_voteId][msg.sender] = true;
        
        emit VoteCast(_voteId, _optionId, msg.sender);
    }
    
    function getVoteDetails(uint256 _voteId) public view returns (
        string memory title,
        string memory description,
        address creator,
        uint256 startTime,
        uint256 endTime,
        bool isActive,
        uint256 totalVotes
    ) {
        require(_voteId < voteCount, "Vote does not exist");
        Vote memory v = votes[_voteId];
        return (v.title, v.description, v.creator, v.startTime, v.endTime, v.isActive, v.totalVotes);
    }
    
    function getVoteOptionsCount(uint256 _voteId) public view returns (uint256) {
        require(_voteId < voteCount, "Vote does not exist");
        return voteOptions[_voteId].length;
    }
    
    function getVoteOption(uint256 _voteId, uint256 _optionId) public view returns (
        string memory text,
        uint256 voteCount
    ) {
        require(_voteId < voteCount, "Vote does not exist");
        require(_optionId < voteOptions[_voteId].length, "Option does not exist");
        Option memory option = voteOptions[_voteId][_optionId];
        return (option.text, option.voteCount);
    }
    
    function getActiveVoteIds() public view returns (uint256[] memory) {
        uint256 activeCount = 0;
        
        // Count active votes first
        for (uint256 i = 0; i < voteCount; i++) {
            if (votes[i].isActive && block.timestamp <= votes[i].endTime) {
                activeCount++;
            }
        }
        
        uint256[] memory activeVotes = new uint256[](activeCount);
        uint256 index = 0;
        
        // Fill the array
        for (uint256 i = 0; i < voteCount && index < activeCount; i++) {
            if (votes[i].isActive && block.timestamp <= votes[i].endTime) {
                activeVotes[index] = i;
                index++;
            }
        }
        
        return activeVotes;
    }
}
