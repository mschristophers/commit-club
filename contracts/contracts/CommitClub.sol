// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title CommitClub
 * @dev N-of-M check-in pot with refunds if threshold not met before deadline
 */
contract CommitClub is ReentrancyGuard {
    using Address for address payable;

    struct Commitment {
        address organizer;
        uint256 stakeAmount;
        uint16 minCheckIns;
        uint64 deadline;
        bytes32 codeHash;
        bool settled;
        uint256 totalStaked;
    }

    mapping(uint256 => Commitment) public commitments;
    mapping(uint256 => mapping(address => bool)) public joined;
    mapping(uint256 => mapping(address => bool)) public checkedIn;
    mapping(uint256 => address[]) public joiners;
    mapping(uint256 => address[]) public attendees;
    mapping(uint256 => mapping(address => uint256)) public balances;

    uint256 public nextCommitmentId = 1;

    event CommitmentCreated(
        uint256 indexed id,
        address indexed organizer,
        string name,
        uint256 stakeAmount,
        uint16 minCheckIns,
        uint64 deadline
    );
    event Joined(uint256 indexed id, address indexed user, uint256 amount);
    event CheckedIn(uint256 indexed id, address indexed user);
    event Settled(uint256 indexed id, address[] attendees, uint256 amountPerPerson);

    error CommitmentNotFound();
    error CommitmentExpired();
    error CommitmentSettled();
    error InvalidStakeAmount();
    error AlreadyJoined();
    error AlreadyCheckedIn();
    error InsufficientPayment();
    error ThresholdNotMet();
    error OnlyOrganizer();

    /**
     * @dev Creates a new commitment
     * @param name Name of the commitment
     * @param stakeAmount Amount each participant must stake
     * @param minCheckIns Minimum number of check-ins required
     * @param deadline Unix timestamp when commitment expires
     * @param codeHash Hash of the secret check-in code
     * @return id The commitment ID
     */
    function createCommit(
        string calldata name,
        uint256 stakeAmount,
        uint16 minCheckIns,
        uint64 deadline,
        bytes32 codeHash
    ) external returns (uint256 id) {
        if (stakeAmount == 0) revert InvalidStakeAmount();
        if (deadline <= block.timestamp) revert CommitmentExpired();
        if (minCheckIns == 0) revert InvalidStakeAmount();

        id = nextCommitmentId++;
        commitments[id] = Commitment({
            organizer: msg.sender,
            stakeAmount: stakeAmount,
            minCheckIns: minCheckIns,
            deadline: deadline,
            codeHash: codeHash,
            settled: false,
            totalStaked: 0
        });

        emit CommitmentCreated(id, msg.sender, name, stakeAmount, minCheckIns, deadline);
    }

    /**
     * @dev Joins a commitment by staking the required amount
     * @param id The commitment ID
     */
    function joinCommit(uint256 id) external payable nonReentrant {
        Commitment storage commitment = commitments[id];
        if (commitment.organizer == address(0)) revert CommitmentNotFound();
        if (commitment.deadline <= block.timestamp) revert CommitmentExpired();
        if (commitment.settled) revert CommitmentSettled();
        if (joined[id][msg.sender]) revert AlreadyJoined();
        if (msg.value != commitment.stakeAmount) revert InsufficientPayment();

        joined[id][msg.sender] = true;
        joiners[id].push(msg.sender);
        balances[id][msg.sender] = commitment.stakeAmount;
        commitment.totalStaked += commitment.stakeAmount;

        emit Joined(id, msg.sender, commitment.stakeAmount);
    }

    /**
     * @dev Checks in to a commitment using the secret code
     * @param id The commitment ID
     * @param code The secret check-in code
     */
    function checkIn(uint256 id, string calldata code) external {
        Commitment storage commitment = commitments[id];
        if (commitment.organizer == address(0)) revert CommitmentNotFound();
        if (commitment.deadline <= block.timestamp) revert CommitmentExpired();
        if (commitment.settled) revert CommitmentSettled();
        if (!joined[id][msg.sender]) revert CommitmentNotFound();
        if (checkedIn[id][msg.sender]) revert AlreadyCheckedIn();
        if (keccak256(bytes(code)) != commitment.codeHash) revert CommitmentNotFound();

        checkedIn[id][msg.sender] = true;
        attendees[id].push(msg.sender);

        emit CheckedIn(id, msg.sender);
    }

    /**
     * @dev Settles a commitment - distributes pot if threshold met, otherwise refunds
     * @param id The commitment ID
     */
    function settleCommit(uint256 id) external nonReentrant {
        Commitment storage commitment = commitments[id];
        if (commitment.organizer == address(0)) revert CommitmentNotFound();
        if (commitment.settled) revert CommitmentSettled();
        if (commitment.deadline > block.timestamp) revert CommitmentExpired();
        if (msg.sender != commitment.organizer) revert OnlyOrganizer();

        commitment.settled = true;

        if (attendees[id].length >= commitment.minCheckIns) {
            // Threshold met - split pot among attendees
            uint256 amountPerPerson = commitment.totalStaked / attendees[id].length;
            
            for (uint256 i = 0; i < attendees[id].length; i++) {
                address attendee = attendees[id][i];
                balances[id][attendee] = 0;
                payable(attendee).sendValue(amountPerPerson);
            }

            emit Settled(id, attendees[id], amountPerPerson);
        } else {
            // Threshold not met - refund all joiners
            for (uint256 i = 0; i < joiners[id].length; i++) {
                address joiner = joiners[id][i];
                uint256 refundAmount = balances[id][joiner];
                balances[id][joiner] = 0;
                payable(joiner).sendValue(refundAmount);
            }

            emit Settled(id, new address[](0), 0);
        }
    }

    /**
     * @dev Gets the list of joiners for a commitment
     * @param id The commitment ID
     * @return Array of joiner addresses
     */
    function getJoiners(uint256 id) external view returns (address[] memory) {
        return joiners[id];
    }

    /**
     * @dev Gets the list of attendees for a commitment
     * @param id The commitment ID
     * @return Array of attendee addresses
     */
    function getAttendees(uint256 id) external view returns (address[] memory) {
        return attendees[id];
    }
}
