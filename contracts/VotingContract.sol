// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title VotingContract
 * @dev A contract for creating and managing decentralized votes
 */
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

    uint256 public voteCount;

    event VoteCreated(uint256 indexed voteId, string title, address indexed creator);
    event VoteCast(uint256 indexed voteId, uint256 optionId, address indexed voter);
    event VoteClosed(uint256 indexed voteId);

    /**
     * @dev Create a new vote with multiple options
     */
    function createVote(
        string memory _title,
        string memory _description,
        string[] memory _options,
        uint256 _startTime,
        uint256 _endTime
    ) public returns (uint256 voteId) {
        require(_options.length >= 2, "Must provide at least 2 options");
        require(_endTime > _startTime, "End time must be after start time");

        voteId = voteCount++;
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
    }

    /**
     * @dev Cast a vote for a specific option
     */
    function castVote(uint256 _voteId, uint256 _optionId) public {
        require(_voteId < voteCount, "Vote does not exist");
        Vote storage vote = votes[_voteId];

        require(vote.isActive, "Vote is not active");
        require(block.timestamp >= vote.startTime, "Voting has not started");
        require(block.timestamp <= vote.endTime, "Voting has ended");
        require(!hasVoted[_voteId][msg.sender], "Already voted");
        require(_optionId < voteOptions[_voteId].length, "Invalid option");

        voteOptions[_voteId][_optionId].voteCount++;
        vote.totalVotes++;
        hasVoted[_voteId][msg.sender] = true;

        emit VoteCast(_voteId, _optionId, msg.sender);
    }

    /**
     * @dev Close a vote manually (creator only)
     */
    function closeVote(uint256 _voteId) public {
        require(_voteId < voteCount, "Vote does not exist");
        Vote storage vote = votes[_voteId];

        require(msg.sender == vote.creator, "Only creator can close");
        require(vote.isActive, "Vote already closed");

        vote.isActive = false;

        emit VoteClosed(_voteId);
    }

    /**
     * @dev Get vote details
     */
    function getVoteDetails(uint256 _voteId)
        public
        view
        returns (
            string memory title,
            string memory description,
            address creator,
            uint256 startTime,
            uint256 endTime,
            bool isActive,
            uint256 totalVotes
        )
    {
        require(_voteId < voteCount, "Vote does not exist");
        Vote memory v = votes[_voteId];

        bool activeStatus = v.isActive && block.timestamp <= v.endTime;

        return (v.title, v.description, v.creator, v.startTime, v.endTime, activeStatus, v.totalVotes);
    }

    /**
     * @dev Get number of options for a vote
     */
    function getVoteOptionsCount(uint256 _voteId) public view returns (uint256) {
        require(_voteId < voteCount, "Vote does not exist");
        return voteOptions[_voteId].length;
    }

    /**
     * @dev Get option details
     */
    function getVoteOption(uint256 _voteId, uint256 _optionId)
        public
        view
        returns (string memory text, uint256 votesForOption)
    {
        require(_voteId < voteCount, "Vote does not exist");
        require(_optionId < voteOptions[_voteId].length, "Option does not exist");

        Option memory option = voteOptions[_voteId][_optionId];
        return (option.text, option.voteCount);
    }

    /**
     * @dev Get all active vote IDs
     */
    function getActiveVoteIds() public view returns (uint256[] memory) {
        uint256 activeCount = 0;

        for (uint256 i = 0; i < voteCount; i++) {
            if (votes[i].isActive && block.timestamp <= votes[i].endTime) {
                activeCount++;
            }
        }

        uint256[] memory activeVotes = new uint256[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < voteCount; i++) {
            if (votes[i].isActive && block.timestamp <= votes[i].endTime) {
                activeVotes[index++] = i;
            }
        }

        return activeVotes;
    }
}
