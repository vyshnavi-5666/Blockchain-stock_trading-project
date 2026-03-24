const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto");

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend correctly
app.use(express.static(path.join(__dirname, "../client")));

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/stockDapp")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Web3
const Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:7545");

const contractAddress = "0x807F270beDf17689FF05726f59F861B8Ec27C0CA";
const contractABI = require("./abi.json");

const contract = new web3.eth.Contract(contractABI, contractAddress);

const ownerAccount = "0xcd74acaeC0d5a5463Cc10B6f2de2F6cB8329013c";

// Merkle hash
function hash(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function buildMerkleTree(leaves) {
  if (!leaves || leaves.length === 0) return null;

  let level = leaves.map(hash);

  while (level.length > 1) {
    let nextLevel = [];

    for (let i = 0; i < level.length; i += 2) {
      if (i + 1 < level.length) {
        nextLevel.push(hash(level[i] + level[i + 1]));
      } else {
        nextLevel.push(hash(level[i] + level[i]));
      }
    }

    level = nextLevel;
  }

  return level[0];
}

// Get trades from chain
async function getAllTradesFromChain() {
  const trades = await contract.methods.getAllTrades().call();
  return trades.map(t => `${t.stock}-${t.quantity}-${t.isBuy}`);
}

// Create block
let lastStoredRoot = null;

async function createBlock() {
  const trades = await getAllTradesFromChain();

  if (trades.length === 0) return;

  const root = buildMerkleTree(trades);
  if (!root) return;

  const merkleRoot = "0x" + root;

  if (merkleRoot === lastStoredRoot) return;

  await contract.methods.addBlock(merkleRoot)
    .send({ from: ownerAccount });

  lastStoredRoot = merkleRoot;

  console.log("Block added:", merkleRoot);
}

// ROUTES

app.use("/api/auth", require("./routes/auth"));
app.use("/api/stocks", require("./routes/stocks"));

// Get blocks
app.get("/api/blocks", async (req, res) => {
  try {
    const blocks = await contract.methods.getBlocks().call();
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// Create block manually
app.get("/api/create-block", async (req, res) => {
  try {
    await createBlock();
    res.send("Block created");
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});