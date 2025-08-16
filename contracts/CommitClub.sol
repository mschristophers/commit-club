// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CommitClub {
    struct Commitment {
        address creator;
        uint256 stakeAmount;
        uint256 requiredCheckIns;
        uint256 minParticipants;
        uint256 deadline;
        string secretCode;
        uint256 totalStaked;
        uint256 participantCount;
        bool settled;
    }

    struct Participant {
        bool joined;
        bool checkedIn;
        bool paidOut;
    }

    uint256 public nextCommitmentId = 1;
    mapping(uint256 => Commitment) public commitments;
    mapping(uint256 => mapping(address => Participant)) public participants;
    mapping(uint256 => address[]) public participantList;

    event CommitmentCreated(uint256 indexed commitmentId, address indexed creator, uint256 stakeAmount, uint256 requiredCheckIns);
    event ParticipantJoined(uint256 indexed commitmentId, address indexed participant);
    event CheckedIn(uint256 indexed commitmentId, address indexed participant);
    event PotSettled(uint256 indexed commitmentId, uint256 winnersCount, uint256 payoutPerWinner);

    modifier commitmentExists(uint256 commitmentId) {
        require(commitments[commitmentId].creator != address(0), "Commitment does not exist");
        _;
    }

    modifier notSettled(uint256 commitmentId) {
        require(!commitments[commitmentId].settled, "Commitment already settled");
        _;
    }

    function createCommitment(
        uint256 stakeAmount,
        uint256 requiredCheckIns,
        uint256 minParticipants,
        uint256 durationHours,
        string memory secretCode
    ) external payable returns (uint256) {
        require(stakeAmount > 0, "Stake amount must be greater than 0");
        require(requiredCheckIns > 0, "Required check-ins must be greater than 0");
        require(minParticipants > 0, "Minimum participants must be greater than 0");
        require(msg.value == stakeAmount, "Must send exact stake amount");
        require(bytes(secretCode).length > 0, "Secret code cannot be empty");

        uint256 commitmentId = nextCommitmentId++;
        
        commitments[commitmentId] = Commitment({
            creator: msg.sender,
            stakeAmount: stakeAmount,
            requiredCheckIns: requiredCheckIns,
            minParticipants: minParticipants,
            deadline: block.timestamp + (durationHours * 1 hours),
            secretCode: secretCode,
            totalStaked: stakeAmount,
            participantCount: 1,
            settled: false
        });

        participants[commitmentId][msg.sender] = Participant({
            joined: true,
            checkedIn: false,
            paidOut: false
        });
        participantList[commitmentId].push(msg.sender);

        emit CommitmentCreated(commitmentId, msg.sender, stakeAmount, requiredCheckIns);
        
        return commitmentId;
    }

    function joinCommitment(uint256 commitmentId) external payable 
        commitmentExists(commitmentId) 
        notSettled(commitmentId) 
    {
        Commitment storage commitment = commitments[commitmentId];
        require(block.timestamp < commitment.deadline, "Commitment deadline passed");
        require(msg.value == commitment.stakeAmount, "Must send exact stake amount");
        require(!participants[commitmentId][msg.sender].joined, "Already joined");

        participants[commitmentId][msg.sender] = Participant({
            joined: true,
            checkedIn: false,
            paidOut: false
        });
        participantList[commitmentId].push(msg.sender);

        commitment.totalStaked += msg.value;
        commitment.participantCount++;

        emit ParticipantJoined(commitmentId, msg.sender);
    }

    function checkIn(uint256 commitmentId, string memory code) external 
        commitmentExists(commitmentId) 
        notSettled(commitmentId) 
    {
        Commitment storage commitment = commitments[commitmentId];
        require(block.timestamp < commitment.deadline, "Commitment deadline passed");
        require(participants[commitmentId][msg.sender].joined, "Not a participant");
        require(!participants[commitmentId][msg.sender].checkedIn, "Already checked in");
        require(keccak256(bytes(code)) == keccak256(bytes(commitment.secretCode)), "Invalid check-in code");

        participants[commitmentId][msg.sender].checkedIn = true;

        emit CheckedIn(commitmentId, msg.sender);
    }

    function settleCommitment(uint256 commitmentId) external 
        commitmentExists(commitmentId) 
        notSettled(commitmentId) 
    {
        Commitment storage commitment = commitments[commitmentId];
        require(block.timestamp >= commitment.deadline, "Deadline not reached");
        require(commitment.participantCount >= commitment.minParticipants, "Not enough participants");

        commitment.settled = true;

        // Count successful participants
        uint256 successCount = 0;
        address[] memory successfulParticipants = new address[](commitment.participantCount);
        
        for (uint256 i = 0; i < participantList[commitmentId].length; i++) {
            address participant = participantList[commitmentId][i];
            if (participants[commitmentId][participant].checkedIn) {
                successfulParticipants[successCount] = participant;
                successCount++;
            }
        }

        if (successCount == 0) {
            // No winners - refund everyone
            for (uint256 i = 0; i < participantList[commitmentId].length; i++) {
                address participant = participantList[commitmentId][i];
                if (!participants[commitmentId][participant].paidOut) {
                    participants[commitmentId][participant].paidOut = true;
                    payable(participant).transfer(commitment.stakeAmount);
                }
            }
            emit PotSettled(commitmentId, 0, 0);
        } else {
            // Distribute pot to successful participants
            uint256 payoutPerWinner = commitment.totalStaked / successCount;
            
            for (uint256 i = 0; i < successCount; i++) {
                participants[commitmentId][successfulParticipants[i]].paidOut = true;
                payable(successfulParticipants[i]).transfer(payoutPerWinner);
            }
            
            // Handle remainder due to division
            uint256 remainder = commitment.totalStaked - (payoutPerWinner * successCount);
            if (remainder > 0) {
                payable(successfulParticipants[0]).transfer(remainder);
            }
            
            emit PotSettled(commitmentId, successCount, payoutPerWinner);
        }
    }

    // View functions
    function getCommitment(uint256 commitmentId) external view returns (
        address creator,
        uint256 stakeAmount,
        uint256 requiredCheckIns,
        uint256 minParticipants,
        uint256 deadline,
        uint256 totalStaked,
        uint256 participantCount,
        bool settled
    ) {
        Commitment storage commitment = commitments[commitmentId];
        return (
            commitment.creator,
            commitment.stakeAmount,
            commitment.requiredCheckIns,
            commitment.minParticipants,
            commitment.deadline,
            commitment.totalStaked,
            commitment.participantCount,
            commitment.settled
        );
    }

    function getParticipantStatus(uint256 commitmentId, address participant) external view returns (
        bool joined,
        bool checkedIn,
        bool paidOut
    ) {
        Participant storage p = participants[commitmentId][participant];
        return (p.joined, p.checkedIn, p.paidOut);
    }

    function getParticipantList(uint256 commitmentId) external view returns (address[] memory) {
        return participantList[commitmentId];
    }
}
