// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StockTrading {

    // ---------------- TRADE STRUCT ----------------
    struct Trade {
        string stock;
        uint quantity;
        bool isBuy;
    }

    // ---------------- BLOCK STRUCT ----------------
    struct Block {
        uint index;
        uint timestamp;
        bytes32 merkleRoot;
        bytes32 previousHash;
        bytes32 hash;
    }

    // ---------------- STORAGE ----------------

    // Per-user trades
    mapping(address => Trade[]) public trades;

    // Global trades (ALL users)
    Trade[] public allTrades;

    // Track holdings
    mapping(address => mapping(string => uint)) public holdings;

    // Owner
    address public owner;

    // Old Merkle storage (optional, can keep or remove)
    bytes32[] public merkleRoots;

    // NEW: Blockchain-style blocks
    Block[] public blocks;

    // ---------------- EVENTS ----------------
    event TradeExecuted(address indexed user, string stock, uint qty, bool isBuy);
    event MerkleRootAdded(bytes32 root);
    event BlockCreated(uint index, bytes32 hash, bytes32 merkleRoot);

    constructor() {
        owner = msg.sender;
    }

    // ---------------- BLOCK FUNCTIONS ----------------

    function addBlock(bytes32 _merkleRoot) public {
        require(msg.sender == owner, "Only owner can add block");

        uint index = blocks.length;
        uint timestamp = block.timestamp;

        bytes32 previousHash = index == 0
            ? bytes32(0)
            : blocks[index - 1].hash;

        bytes32 hash = keccak256(
            abi.encodePacked(index, timestamp, _merkleRoot, previousHash)
        );

        blocks.push(Block(index, timestamp, _merkleRoot, previousHash, hash));

        emit BlockCreated(index, hash, _merkleRoot);
    }

    function getBlocks() public view returns (Block[] memory) {
        return blocks;
    }

    function getLatestBlock() public view returns (Block memory) {
        require(blocks.length > 0, "No blocks yet");
        return blocks[blocks.length - 1];
    }

    // ---------------- MERKLE FUNCTIONS (OPTIONAL) ----------------

    function addMerkleRoot(bytes32 _root) public {
        require(msg.sender == owner, "Only owner can add root");

        merkleRoots.push(_root);

        emit MerkleRootAdded(_root);
    }

    function getMerkleRoots() public view returns (bytes32[] memory) {
        return merkleRoots;
    }

    function getLatestMerkleRoot() public view returns (bytes32) {
        require(merkleRoots.length > 0, "No roots yet");
        return merkleRoots[merkleRoots.length - 1];
    }

    // ---------------- TRADING FUNCTIONS ----------------

    function buyStock(string memory _stock, uint _qty) public {
        require(_qty > 0, "Invalid quantity");
        require(_qty <= 1000, "Too large order");

        holdings[msg.sender][_stock] += _qty;

        Trade memory t = Trade(_stock, _qty, true);

        trades[msg.sender].push(t);
        allTrades.push(t);

        emit TradeExecuted(msg.sender, _stock, _qty, true);
    }

    function sellStock(string memory _stock, uint _qty) public {
        require(_qty > 0, "Invalid quantity");
        require(_qty <= 1000, "Too large order");

        require(
            holdings[msg.sender][_stock] >= _qty,
            "Not enough stocks to sell"
        );

        holdings[msg.sender][_stock] -= _qty;

        Trade memory t = Trade(_stock, _qty, false);

        trades[msg.sender].push(t);
        allTrades.push(t);

        emit TradeExecuted(msg.sender, _stock, _qty, false);
    }

    function getTrades() public view returns (Trade[] memory) {
        return trades[msg.sender];
    }

    function getAllTrades() public view returns (Trade[] memory) {
        return allTrades;
    }

    function getHolding(string memory _stock) public view returns (uint) {
        return holdings[msg.sender][_stock];
    }
    function getBlocksCount() public view returns (uint) {
    return blocks.length;
    }
}