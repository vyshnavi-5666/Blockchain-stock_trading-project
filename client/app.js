let chart;
let web3;
let contract;

const contractAddress = "0x807F270beDf17689FF05726f59F861B8Ec27C0CA";
const ownerAccount = "0xcd74acaeC0d5a5463Cc10B6f2de2F6cB8329013c";
const abi = [
  {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "hash",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "merkleRoot",
          "type": "bytes32"
        }
      ],
      "name": "BlockCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "root",
          "type": "bytes32"
        }
      ],
      "name": "MerkleRootAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "stock",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "qty",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isBuy",
          "type": "bool"
        }
      ],
      "name": "TradeExecuted",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "allTrades",
      "outputs": [
        {
          "internalType": "string",
          "name": "stock",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "quantity",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isBuy",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "blocks",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "merkleRoot",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "previousHash",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "hash",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "holdings",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "merkleRoots",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "trades",
      "outputs": [
        {
          "internalType": "string",
          "name": "stock",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "quantity",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isBuy",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_merkleRoot",
          "type": "bytes32"
        }
      ],
      "name": "addBlock",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getBlocks",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "bytes32",
              "name": "merkleRoot",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "previousHash",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "hash",
              "type": "bytes32"
            }
          ],
          "internalType": "struct StockTrading.Block[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getLatestBlock",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "bytes32",
              "name": "merkleRoot",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "previousHash",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "hash",
              "type": "bytes32"
            }
          ],
          "internalType": "struct StockTrading.Block",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_root",
          "type": "bytes32"
        }
      ],
      "name": "addMerkleRoot",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getMerkleRoots",
      "outputs": [
        {
          "internalType": "bytes32[]",
          "name": "",
          "type": "bytes32[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getLatestMerkleRoot",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_stock",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_qty",
          "type": "uint256"
        }
      ],
      "name": "buyStock",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_stock",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_qty",
          "type": "uint256"
        }
      ],
      "name": "sellStock",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTrades",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "stock",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "quantity",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isBuy",
              "type": "bool"
            }
          ],
          "internalType": "struct StockTrading.Trade[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getAllTrades",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "stock",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "quantity",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isBuy",
              "type": "bool"
            }
          ],
          "internalType": "struct StockTrading.Trade[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_stock",
          "type": "string"
        }
      ],
      "name": "getHolding",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getBlocksCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
];

const API = "http://localhost:5000/api";
let selectedStock = "";

/* INIT */
window.onload = initApp;

async function initApp() {
  try {
    await connectBlockchain();
    await loadStocks();
    await loadPortfolio();
    await loadMostBought();

    if (typeof loadChartOptions === "function") {
      loadChartOptions();
    }
  } catch (err) {
    console.error("Init error:", err);
  }
}

async function connectBlockchain() {
  if (!window.ethereum) {
    alert("Install MetaMask");
    return;
  }

  try {
    web3 = new Web3(window.ethereum);

    // Request account access
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    console.log("Connected account:", accounts[0]);

    // ❗ DO NOT FETCH ABI AGAIN
    contract = new web3.eth.Contract(abi, contractAddress);

    console.log("Contract loaded:", contract);
    console.log("Contract address:", contractAddress);
    console.log("ABI loaded:", abi.length);
  } catch (err) {
    console.error("Blockchain connection failed:", err);
    alert("Blockchain connection failed");
  }
}
/* LOGIN  */
async function login() {
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();

  const res = await fetch(`${API}/auth/login`, {   // FIX
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  const text = await res.text();

  if (!res.ok) {
    alert(text);
    return;
  }

  const data = JSON.parse(text);
  localStorage.setItem("user", JSON.stringify(data));

  window.location.href = "home.html";
}
/* REGISTER  */
async function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const aadhaar = document.getElementById("aadhaar").value;

  await fetch(`${API}/auth/register`, {   //  FIX
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, email, password, aadhaar })
  });

  alert("Registered!");
  window.location.href = "login.html";
}

/* LOAD STOCKS */
async function loadStocks() {
  const container = document.getElementById("stocks");
  if (!container) return;

  container.innerHTML = "";

  try {
    const res = await fetch(`${API}/stocks`);
    const stocks = await res.json();

    let trades = [];
    const accounts = await web3.eth.getAccounts();

    try {
      trades = await contract.methods.getTrades().call({ from: accounts[0] });
    } catch (err) {
      console.warn("getTrades failed:", err.message);
    }

    stocks.forEach(s => {
      let buy = 0, sell = 0;

      trades.forEach(t => {
        if (t.stock === s.name) {
          if (t.isBuy) buy += parseInt(t.quantity);
          else sell += parseInt(t.quantity);
        }
      });

      const dynamicPrice = s.price + (buy - sell) * 2;

      container.innerHTML += `
        <div class="card">
          <h3>${s.name}</h3>
          <p>₹${dynamicPrice}</p>
          <small>Buy: ${buy} | Sell: ${sell}</small><br>
          <button onclick="openPopup('${s.name}')">Trade</button>
          <button onclick="openChart('${s.name}')">📈</button>
        </div>
      `;
    });

  } catch (err) {
    console.error("loadStocks error:", err);
  }
}

/* SIDEBAR */
function showSection(section) {
  document.getElementById("stocksSection").classList.add("hidden");
  document.getElementById("portfolioSection").classList.add("hidden");
  document.getElementById("popularSection").classList.add("hidden");

  if (section === "stocks") {
    document.getElementById("stocksSection").classList.remove("hidden");
    loadStocks();
  }

  if (section === "portfolio") {
    document.getElementById("portfolioSection").classList.remove("hidden");
    loadPortfolio(); // ✅ load portfolio here
  }

  if (section === "popular") {
    document.getElementById("popularSection").classList.remove("hidden");
    loadMostBought(); // ✅ load most bought here
  }
}
/* POPUP */
function openPopup(name) {
  selectedStock = name;
  document.getElementById("stockName").innerText = name;
  document.getElementById("popup").classList.remove("hidden");
}
/*open chart*/
function openChart(stockName) {
  // store selected stock
  localStorage.setItem("chartStock", stockName);

  // open new page
  window.location.href = "chart.html";
}
function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}
async function buy() {
  console.log("BUY CLICKED");

  if (!contract) {
    alert("Contract not loaded");
    return;
  }

  if (!selectedStock) {
    alert("No stock selected");
    return;
  }

  const qty = parseInt(document.getElementById("qty").value);

  if (!qty || qty <= 0) {
    alert("Invalid quantity");
    return;
  }

  try {
    const accounts = await web3.eth.getAccounts();

    await contract.methods
      .buyStock(selectedStock, qty)
      .send({ from: accounts[0] });

    alert("✅ Bought successfully");

    closePopup();
    refreshUI();

  } catch (err) {
    console.error("BUY ERROR:", err);
    alert(err.message);
  }
}
/* SELL */
async function sell() {
  const qty = parseInt(document.getElementById("qty").value);

  const accounts = await web3.eth.getAccounts();

  // ✅ get current dynamic price from UI logic
  const res = await fetch(`${API}/stocks`);
  const stocks = await res.json();

  const stockData = stocks.find(s => s.name === selectedStock);
  const currentPrice = stockData.price;

  try {
    await contract.methods.sellStock(selectedStock, qty)
      .send({ from: accounts[0] });

    alert(`Sold at price ₹${currentPrice}`);

    closePopup();
    refreshUI();

  } catch (err) {
    alert(err.message);
  }
}


/* REFRESH */
async function refreshUI() {
  await loadStocks();
  await loadPortfolio();
  await loadMostBought();
}
/* UI HELPERS */
function openPopup(name) {
  selectedStock = name;
  document.getElementById("popup").classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

function openChart(stockName) {
  localStorage.setItem("chartStock", stockName);
  window.location.href = "chart.html";
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

function loadChartOptions() {
  console.log("Chart options loaded");
}

/* PORTFOLIO */
async function loadPortfolio() {
  const container = document.getElementById("portfolio");
  if (!container) return;

  container.innerHTML = "";

  try {
    const accounts = await web3.eth.getAccounts();

    const trades = await contract.methods.getTrades().call({ from: accounts[0] });

    const res = await fetch(`${API}/stocks`);
    const stocks = await res.json();

    const priceMap = {};
    stocks.forEach(s => priceMap[s.name] = s.price);

    const portfolio = {};

    trades.forEach(t => {
      if (!portfolio[t.stock]) {
        portfolio[t.stock] = { buy: 0, sell: 0 };
      }

      if (t.isBuy) portfolio[t.stock].buy += parseInt(t.quantity);
      else portfolio[t.stock].sell += parseInt(t.quantity);
    });

    let html = `
      <table border="1" cellpadding="10">
        <tr>
          <th>Stock</th>
          <th>Buy</th>
          <th>Sell</th>
          <th>Net</th>
          <th>Price</th>
          <th>P/L</th>
        </tr>
    `;

    for (let stock in portfolio) {
      const buy = portfolio[stock].buy;
      const sell = portfolio[stock].sell;
      const net = buy - sell;
      const price = priceMap[stock] || 0;
      const pl = net * price;

      html += `
        <tr>
          <td>${stock}</td>
          <td>${buy}</td>
          <td>${sell}</td>
          <td>${net}</td>
          <td>${price}</td>
          <td style="color:${pl >= 0 ? 'green' : 'red'}">${pl}</td>
        </tr>
      `;
    }

    html += "</table>";
    container.innerHTML = html;

  } catch (err) {
    console.error("Portfolio error:", err);
  }
}

/* CHART PAGE - 6 months data */
async function loadChartPage() {
  const stock = localStorage.getItem("chartStock");
  document.getElementById("chartTitle").innerText = stock + " Chart";

  const weeks = [];
  const dataPrices = [];
  const buyTrades = [];
  const sellTrades = [];

  const accounts = await web3.eth.getAccounts();
  const trades = await contract.methods.getTrades().call({ from: accounts[0] });

  let price = 100;

  for (let i = 26; i >= 1; i--) {
    weeks.push(`Week-${i}`);

    price = price + Math.floor(Math.random() * 20 - 10);
    dataPrices.push(price);

    buyTrades.push(Math.random() < 0.1 ? price : null);
    sellTrades.push(Math.random() < 0.1 ? price : null);
  }

  const ctx = document.getElementById("chart").getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: weeks,
      datasets: [
        {
          label: stock,
          data: dataPrices,
          borderColor: "#4ade80",
          borderWidth: 2,
          fill: false,
          tension: 0.2
        },
        {
          label: "Buy",
          data: buyTrades,
          borderColor: "#22c55e",
          backgroundColor: "#22c55e",
          showLine: false,
          pointStyle: 'triangle',
          pointRadius: 8
        },
        {
          label: "Sell",
          data: sellTrades,
          borderColor: "#f87171",
          backgroundColor: "#f87171",
          showLine: false,
          pointStyle: 'rectRot',
          pointRadius: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: { beginAtZero: false }
      }
    }
  });
} //  IMPORTANT: THIS CLOSES loadChartPage


/* MOST BOUGHT */
async function loadMostBought() {
  const container = document.getElementById("popular");
  if (!container) return;

  container.innerHTML = "";

  try {
    const trades = await contract.methods.getAllTrades().call();

    const count = {};

    trades.forEach(t => {
      if (t.isBuy) {
        if (!count[t.stock]) count[t.stock] = 0;
        count[t.stock] += parseInt(t.quantity);
      }
    });

    const sorted = Object.entries(count).sort((a, b) => b[1] - a[1]);

    if (sorted.length === 0) {
      container.innerHTML = "<p>No data yet</p>";
      return;
    }

    sorted.forEach(([stock, qty]) => {
      container.innerHTML += `
        <div class="card">
          <h3>${stock}</h3>
          <p>🔥 Bought: ${qty}</p>
        </div>
      `;
    });

  } catch (err) {
    console.error("Popular error:", err);
  }
}

function updateBalance(trades, stocks) {
  let balance = 100000; // starting balance

  const priceMap = {};
  stocks.forEach(s => priceMap[s.name] = s.price);

  trades.forEach(t => {
    const price = priceMap[t.stock] || 0;

    if (t.isBuy) balance -= price * t.quantity;
    else balance += price * t.quantity;
  });

  document.getElementById("balance").innerText = "Balance: ₹" + balance;
}
