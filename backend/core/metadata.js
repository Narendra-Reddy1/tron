
const tokenConfig = {
    address: "TAstCF7ArG7JHHtt1GP5FCtRgNkNvdHfff",
    abi: [{ "inputs": [{ "name": "_name", "type": "string" }, { "name": "_symbol", "type": "string" }, { "name": "_totalSupply", "type": "uint256" }], "stateMutability": "Nonpayable", "type": "Constructor" }, { "inputs": [{ "name": "spender", "type": "address" }, { "name": "allowance", "type": "uint256" }, { "name": "needed", "type": "uint256" }], "name": "ERC20InsufficientAllowance", "type": "Error" }, { "inputs": [{ "name": "sender", "type": "address" }, { "name": "balance", "type": "uint256" }, { "name": "needed", "type": "uint256" }], "name": "ERC20InsufficientBalance", "type": "Error" }, { "inputs": [{ "name": "approver", "type": "address" }], "name": "ERC20InvalidApprover", "type": "Error" }, { "inputs": [{ "name": "receiver", "type": "address" }], "name": "ERC20InvalidReceiver", "type": "Error" }, { "inputs": [{ "name": "sender", "type": "address" }], "name": "ERC20InvalidSender", "type": "Error" }, { "inputs": [{ "name": "spender", "type": "address" }], "name": "ERC20InvalidSpender", "type": "Error" }, { "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "Approval", "type": "Event" }, { "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "Transfer", "type": "Event" }, { "outputs": [{ "type": "uint256" }], "inputs": [{ "name": "owner", "type": "address" }, { "name": "spender", "type": "address" }], "name": "allowance", "stateMutability": "View", "type": "Function" }, { "outputs": [{ "type": "bool" }], "inputs": [{ "name": "spender", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "approve", "stateMutability": "Nonpayable", "type": "Function" }, { "outputs": [{ "type": "uint256" }], "inputs": [{ "name": "account", "type": "address" }], "name": "balanceOf", "stateMutability": "View", "type": "Function" }, { "outputs": [{ "type": "uint8" }], "name": "decimals", "stateMutability": "View", "type": "Function" }, { "outputs": [{ "type": "string" }], "name": "name", "stateMutability": "View", "type": "Function" }, { "outputs": [{ "type": "string" }], "name": "symbol", "stateMutability": "View", "type": "Function" }, { "outputs": [{ "type": "uint256" }], "name": "totalSupply", "stateMutability": "View", "type": "Function" }, { "outputs": [{ "type": "bool" }], "inputs": [{ "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "transfer", "stateMutability": "Nonpayable", "type": "Function" }, { "outputs": [{ "type": "bool" }], "inputs": [{ "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "transferFrom", "stateMutability": "Nonpayable", "type": "Function" }]
}

const ledgerConfig = {
    address: "TVgmyZuz6RaN1hTXWdkiBBYmnNqyEg2HxH",
    abi: [{ "inputs": [{ "name": "erc20Token", "type": "address" }, { "name": "_baseUri", "type": "string" }], "stateMutability": "Nonpayable", "type": "Constructor" }, { "name": "HL__AlreadyParticipated", "type": "Error" }, { "name": "HL__NotParticipated", "type": "Error" }, { "name": "HL__TournamentCreationFailed", "type": "Error" }, { "name": "HL__TournamentOver", "type": "Error" }, { "name": "HL__TournamentRunning", "type": "Error" }, { "inputs": [{ "name": "owner", "type": "address" }], "name": "OwnableInvalidOwner", "type": "Error" }, { "inputs": [{ "name": "account", "type": "address" }], "name": "OwnableUnauthorizedAccount", "type": "Error" }, { "name": "ReentrancyGuardReentrantCall", "type": "Error" }, { "name": "NewTournamentStarted", "type": "Event" }, { "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "Event" }, { "inputs": [{ "indexed": true, "type": "address" }, { "type": "uint256" }], "name": "PrizeDistributedToWinner", "type": "Event" }, { "inputs": [{ "type": "address" }, { "type": "uint256" }], "name": "RecordStepsSuccess", "type": "Event" }, { "inputs": [{ "type": "address" }, { "type": "uint256" }], "name": "TournamentJoined", "type": "Event" }, { "inputs": [{ "name": "_tournamentId", "type": "uint256" }, { "name": "_participant", "type": "address" }], "name": "forceJoinTournament", "stateMutability": "Nonpayable", "type": "Function" }, { "outputs": [{ "type": "uint256" }], "inputs": [{ "name": "_tournamentId", "type": "uint256" }], "name": "getEndTime", "stateMutability": "View", "type": "Function" }, { "outputs": [{ "type": "uint256" }], "name": "getLastTournamentId", "stateMutability": "View", "type": "Function" }, { "outputs": [{ "type": "address" }], "name": "getNFTContractAddress", "stateMutability": "View", "type": "Function" }, { "outputs": [{ "type": "uint256" }], "name": "getNFTCounter", "stateMutability": "View", "type": "Function" }, { "outputs": [{ "type": "uint256" }], "inputs": [{ "name": "_tournamentId", "type": "uint256" }], "name": "getPrizepool", "stateMutability": "View", "type": "Function" }, { "outputs": [{ "type": "uint256" }], "inputs": [{ "name": "_tournamentId", "type": "uint256" }], "name": "getStartTime", "stateMutability": "View", "type": "Function" }, { "outputs": [{ "type": "address" }], "name": "getTokenContract", "stateMutability": "View", "type": "Function" }, { "outputs": [{ "type": "uint256" }, { "type": "uint256" }, { "type": "uint256" }], "inputs": [{ "name": "_tournamentId", "type": "uint256" }], "name": "getTournamentInfo", "stateMutability": "View", "type": "Function" }, { "outputs": [{ "type": "uint256" }], "inputs": [{ "name": "_tournamentId", "type": "uint256" }, { "name": "_user", "type": "address" }], "name": "getUserStepCount", "stateMutability": "View", "type": "Function" }, { "outputs": [{ "type": "bool" }], "inputs": [{ "name": "_tournamentId", "type": "uint256" }], "name": "isTournamentRunning", "stateMutability": "View", "type": "Function" }, { "outputs": [{ "type": "bool" }], "inputs": [{ "name": "_tournamentId", "type": "uint256" }, { "name": "_user", "type": "address" }], "name": "isUserParticipatedInTournament", "stateMutability": "View", "type": "Function" }, { "inputs": [{ "name": "_tournamentId", "type": "uint256" }], "name": "joinTournament", "stateMutability": "Nonpayable", "type": "Function" }, { "outputs": [{ "type": "address" }], "name": "owner", "stateMutability": "View", "type": "Function" }, { "inputs": [{ "name": "_tournamentId", "type": "uint256" }, { "name": "_user", "type": "address" }, { "name": "_steps", "type": "uint256" }], "name": "recordSteps", "stateMutability": "Nonpayable", "type": "Function" }, { "name": "renounceOwnership", "stateMutability": "Nonpayable", "type": "Function" }, { "inputs": [{ "name": "_user", "type": "address" }, { "name": "_tokenURI", "type": "string" }], "name": "rewardNFT", "stateMutability": "Nonpayable", "type": "Function" }, { "outputs": [{ "name": "success", "type": "bool" }], "inputs": [{ "name": "_tournamentId", "type": "uint256" }, { "name": "_winner", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "rewardWinner", "stateMutability": "Nonpayable", "type": "Function" }, { "outputs": [{ "name": "id", "type": "uint256" }], "inputs": [{ "name": "_startTime", "type": "uint256" }, { "name": "_endTime", "type": "uint256" }, { "name": "_prizePool", "type": "uint256" }], "name": "startTournament", "stateMutability": "Nonpayable", "type": "Function" }, { "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "stateMutability": "Nonpayable", "type": "Function" }]
}
const nftConfig = {
    address: "",
    abi: []
}
module.exports = { tokenConfig, ledgerConfig, nftConfig }