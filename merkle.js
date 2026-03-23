const crypto = require("crypto");

// Hash function
function hash(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

// Build Merkle Tree
function buildMerkleTree(leaves) {
  if (!leaves || leaves.length === 0) return null;

  // Step 1: hash all leaves
  let level = leaves.map(hash);

  console.log("Leaf hashes:", level);

  // Step 2: build tree
  while (level.length > 1) {
    let nextLevel = [];

    for (let i = 0; i < level.length; i += 2) {
      if (i + 1 < level.length) {
        nextLevel.push(hash(level[i] + level[i + 1]));
      } else {
        // duplicate last node if odd
        nextLevel.push(hash(level[i] + level[i]));
      }
    }

    level = nextLevel;
    console.log("Next level:", level);
  }

  return level[0]; // Merkle Root
}

// Example with 5 blocks
const blocks = [
  "Block1 Data",
  "Block2 Data",
  "Block3 Data",
  "Block4 Data",
  "Block5 Data"
];

const root = buildMerkleTree(blocks);

console.log("Merkle Root:", root);