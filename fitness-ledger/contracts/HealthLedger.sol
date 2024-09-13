// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {HealthLedgerNFT} from "./HealthLedgerNFT.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract HealthLedger is Ownable, ReentrancyGuard {
    struct Tournament {
        uint256 startDate;
        uint256 endDate;
        uint256 prizePool;
        mapping(address => bool) isParticipated;
        mapping(address => uint256) userStepCount;
    }

    /////////////////////////////////////////////////////////
    ///////////////// STATE VARIABLES ///////////////////////
    /////////////////////////////////////////////////////////

    mapping(uint256 torunamentId => Tournament) private s_tournaments;

    IERC20 private s_token;
    uint256 private s_tournamentCount;

    HealthLedgerNFT private s_nft;
    uint256 private s_nftCounter;
    //mapping(address => uint256) winnersMap;

    event NewTournamentStarted();
    event TournamentJoined(address, uint256);
    event RecordStepsSuccess(address, uint256);
    event PrizeDistributedToWinner(address indexed, uint256);

    error HL__TournamentOver();
    error HL__TournamentRunning();
    error HL__AlreadyParticipated();
    error HL__NotParticipated();
    ///error HL__BalanceTransferFailed();
    error HL__TournamentCreationFailed();

    constructor(address erc20Token, string memory _baseUri) Ownable(msg.sender) {
        s_token = IERC20(erc20Token);
        s_nft = new HealthLedgerNFT("FitnessFreak", "FTF", _baseUri);
    }

    function startTournament(uint256 _startTime, uint256 _endTime, uint256 _prizePool)
        external
        onlyOwner
        returns (uint256 id)
    {
        require(
            (_startTime < _endTime && _endTime > block.timestamp && _prizePool > 0), "HL: Invalid tournament params"
        );
        Tournament storage tournament = s_tournaments[s_tournamentCount];
        id = s_tournamentCount;
        ++s_tournamentCount;
        tournament.startDate = _startTime;
        tournament.endDate = _endTime;
        tournament.prizePool = _prizePool;
        bool success = s_token.transferFrom(msg.sender, address(this), _prizePool);
        if (!success) revert HL__TournamentCreationFailed();
        emit NewTournamentStarted();
    }

    function joinTournament(uint256 _tournamentId) external {
        if (!isTournamentRunning(_tournamentId)) revert HL__TournamentOver();
        if (isUserParticipatedInTournament(_tournamentId, msg.sender)) revert HL__AlreadyParticipated();
        Tournament storage tournament = s_tournaments[_tournamentId];
        tournament.isParticipated[msg.sender] = true;
        tournament.userStepCount[msg.sender] = 0;
        emit TournamentJoined(msg.sender, _tournamentId);
    }

    //Added OnlyOwner to pay gas fee only.
    function forceJoinTournament(uint256 _tournamentId, address _participant) external onlyOwner {
        if (!isTournamentRunning(_tournamentId)) revert HL__TournamentOver();
        if (isUserParticipatedInTournament(_tournamentId, _participant)) revert HL__AlreadyParticipated();
        Tournament storage tournament = s_tournaments[_tournamentId];
        tournament.isParticipated[_participant] = true;
        tournament.userStepCount[_participant] = 0;
        emit TournamentJoined(_participant, _tournamentId);
    }

    function recordSteps(uint256 _tournamentId, address _user, uint256 _steps) external onlyOwner {
        if (!isTournamentRunning(_tournamentId)) revert HL__TournamentOver();
        if (!isUserParticipatedInTournament(_tournamentId, _user)) revert HL__NotParticipated();
        Tournament storage tournament = s_tournaments[_tournamentId];
        tournament.userStepCount[_user] += _steps;
        emit RecordStepsSuccess(_user, _steps);
    }

    //Added OnlyOwner to pay gas fee only.
    //How about just approving the reward amount so that users can withdraw themselves...and they'll pay gas for their reward....
    function rewardWinner(uint256 _tournamentId, address _winner, uint256 _amount)
        external
        onlyOwner
        nonReentrant
        returns (bool success)
    {
        if (isTournamentRunning(_tournamentId)) revert HL__TournamentRunning();
        if (!(isUserParticipatedInTournament(_tournamentId, _winner))) revert HL__NotParticipated();
        success = s_token.transfer(_winner, _amount);
        if (!success) {
            s_token.approve(_winner, _amount); //Approving winner to directly withdraw funds
            return false;
        }
        emit PrizeDistributedToWinner(_winner, _amount);
    }

    function rewardNFT(address _user, string calldata _tokenURI) public onlyOwner nonReentrant {
        s_nft.mint(_user, s_nftCounter, _tokenURI);
        ++s_nftCounter;
    }

    /////////////////////////////////////////////////////////
    /////////////////// VIEW && PURE ////////////////////////
    /////////////////////////////////////////////////////////

    function isUserParticipatedInTournament(uint256 _tournamentId, address _user) public view returns (bool) {
        return s_tournaments[_tournamentId].isParticipated[_user];
    }

    function getUserStepCount(uint256 _tournamentId, address _user) public view returns (uint256) {
        return s_tournaments[_tournamentId].userStepCount[_user];
    }

    function getStartTime(uint256 _tournamentId) public view returns (uint256) {
        return s_tournaments[_tournamentId].startDate;
    }

    function getEndTime(uint256 _tournamentId) public view returns (uint256) {
        return s_tournaments[_tournamentId].endDate;
    }

    function getTournamentInfo(uint256 _tournamentId) external view returns (uint256, uint256, uint256) {
        return (
            s_tournaments[_tournamentId].startDate,
            s_tournaments[_tournamentId].endDate,
            s_tournaments[_tournamentId].prizePool
        );
    }

    function getPrizepool(uint256 _tournamentId) public view returns (uint256) {
        return s_tournaments[_tournamentId].prizePool;
    }

    function isTournamentRunning(uint256 _tournamentId) public view returns (bool) {
        bool isRunning = (
            s_tournaments[_tournamentId].endDate > block.timestamp
                && s_tournaments[_tournamentId].startDate < block.timestamp
        );
        return isRunning;
    }

    function getLastTournamentId() public view returns (uint256) {
        return s_tournamentCount > 0 ? s_tournamentCount - 1 : s_tournamentCount;
    }

    function getTokenContract() public view returns (address) {
        return address(s_token);
    }

    function getNFTContractAddress() external view returns (address) {
        return address(s_nft);
    }

    function getNFTCounter() external view returns (uint256) {
        return s_nftCounter;
    }
}
