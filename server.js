const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto");

const app = express();

// ------------------ MIDDLEWARE ------------------
app.use(cors());
app.use(express.json());

// OPTIONAL: Safe CSP (can remove if issues persist)
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' http://localhost:5000 http://127.0.0.1:7545; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  );
  next();
});

// ------------------ MONGODB ------------------
mongoose.connect("mongodb://127.0.0.1:27017/stockDapp")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// ------------------ WEB3 ------------------
const Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:7545");

const contractAddress = "0x310E876344CdBC2B29C6865E4D0Ae66856492df5";
const contractABI = require("./abi.json");

const contract = new web3.eth.Contract(contractABI, contractAddress);

const ownerAccount = "0x04A137Dc5987e7A7F4e10e90Dc6e0E0d6D8eB06D";

// ------------------ MERKLE TREE ------------------
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

// ------------------ FETCH TRADES ------------------
async function getAllTradesFromChain() {
  const trades = await contract.methods.getAllTrades().call();
  return trades.map(t => `${t.stock}-${t.quantity}-${t.isBuy}`);
}

// ------------------ BLOCK CREATION ------------------
let lastStoredRoot = null;

async function createBlock() {
  try {
    const trades = await getAllTradesFromChain();

    if (trades.length === 0) {
      console.log("No trades yet");
      return;
    }

    const merkleRootRaw = buildMerkleTree(trades);
    if (!merkleRootRaw) return;

    const merkleRoot = "0x" + merkleRootRaw;

    if (merkleRoot === lastStoredRoot) {
      console.log("No new trades → skipping block");
      return;
    }

    console.log("Creating block:", merkleRoot);

    await contract.methods.addBlock(merkleRoot)
      .send({ from: ownerAccount });

    lastStoredRoot = merkleRoot;

    console.log("Block added");

  } catch (err) {
    console.error("Block creation error:", err);
  }
}

// ------------------ ROUTES ------------------

// Auth
app.use("/api/auth", require("./routes/auth"));

// Stocks
app.use("/api/stocks", require("./routes/stocks"));

// ✅ GET BLOCKS (MAIN FIX)
app.get("/api/blocks", async (req, res) => {
  try {
    const count = await contract.methods.getBlocksCount().call();

    let blocks = [];

    for (let i = 0; i < count; i++) {
      const block = await contract.methods.blocks(i).call();
      blocks.push(block);
    }

    res.json(blocks);

  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// Manual block trigger
app.get("/api/create-block", async (req, res) => {
  try {
    await createBlock();
    res.send("Block created");
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

// Serve frontend
app.use(express.static(path.join(__dirname, "../client")));

// ------------------ START SERVER ------------------
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
app.get("/", (req, res) => {
  res.send("Server is running ");
});