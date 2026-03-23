let chart;
let web3;
let contract;

const contractAddress = "0x310E876344CdBC2B29C6865E4D0Ae66856492df5";
const ownerAccount = "0x04A137Dc5987e7A7F4e10e90Dc6e0E0d6D8eB06D";
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
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTrades",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "stock", "type": "string" },
          { "internalType": "uint256", "name": "quantity", "type": "uint256" },
          { "internalType": "bool", "name": "isBuy", "type": "bool" }
        ],
        "internalType": "struct StockTrading.Trade[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllTrades",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "stock", "type": "string" },
          { "internalType": "uint256", "name": "quantity", "type": "uint256" },
          { "internalType": "bool", "name": "isBuy", "type": "bool" }
        ],
        "internalType": "struct StockTrading.Trade[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_stock", "type": "string" }
    ],
    "name": "getHolding",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_stock", "type": "string" },
      { "internalType": "uint256", "name": "_qty", "type": "uint256" }
    ],
    "name": "buyStock",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_stock", "type": "string" },
      { "internalType": "uint256", "name": "_qty", "type": "uint256" }
    ],
    "name": "sellStock",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "string", "name": "", "type": "string" }
    ],
    "name": "holdings",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const API = "http://localhost:5000/api";
let selectedStock = "";

/* INIT */
async function initApp() {
  await connectBlockchain();
  loadStocks();
  loadChartOptions();
}

/* BLOCKCHAIN CONNECT */
async function connectBlockchain() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });

    contract = new web3.eth.Contract(abi, contractAddress);
    console.log("Blockchain connected");

    // ✅ ADD EVENT LISTENER HERE
    contract.events.TradeExecuted()
    .on("data", async (event) => {
      console.log("New Trade:", event.returnValues);

      // 🔥 LIVE UI UPDATE
      await loadPortfolio();
      await loadStocks();
      await loadMostBought();
    })
    .on("error", console.error);

  } else {
    alert("Install MetaMask");
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
  const res = await fetch(`${API}/stocks`);
  const stocks = await res.json();

  const accounts = await web3.eth.getAccounts();
  const trades = await contract.methods.getTrades().call({ from: accounts[0] });

  const container = document.getElementById("stocks");
  container.innerHTML = "";

  stocks.forEach(s => {

    let buy = 0, sell = 0;

    trades.forEach(t => {
      if (t.stock === s.name) {
        if (t.isBuy) buy += parseInt(t.quantity);
        else sell += parseInt(t.quantity);
      }
    });

    // Dynamic price logic
    let dynamicPrice = s.price + (buy - sell) * 2;

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

  updateBalance(trades, stocks);
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

/* BUY */
async function buy() {
  const qty = parseInt(document.getElementById("qty").value);
  if (!qty || qty <= 0) return alert("Enter a valid quantity");

  const accounts = await web3.eth.getAccounts();

  await contract.methods.buyStock(selectedStock, qty)
    .send({ from: accounts[0] });

  alert("Bought successfully");

  closePopup(); // close modal
  refreshUI();  // ✅ update trades, portfolio, and balance
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
async function refreshUI() {
  // Reload trades from blockchain
  const accounts = await web3.eth.getAccounts();
  const trades = await contract.methods.getTrades().call({ from: accounts[0] });

  // Reload stocks to update buy/sell counts and dynamic price
  await loadStocks(); // this already updates balance as well

  // Reload portfolio
  await loadPortfolio();

  // Reload most bought stocks
  await loadMostBought();
}
/* PORTFOLIO */
async function loadPortfolio() {
  const accounts = await web3.eth.getAccounts();
  const trades = await contract.methods.getTrades().call({ from: accounts[0] });

  const res = await fetch(`${API}/stocks`);
  const stocks = await res.json();

  // Create stock price map
  const priceMap = {};
  stocks.forEach(s => priceMap[s.name] = s.price);

  // Calculate holdings
  const portfolio = {};

  trades.forEach(t => {
    if (!portfolio[t.stock]) {
      portfolio[t.stock] = { buy: 0, sell: 0 };
    }

    if (t.isBuy) {
      portfolio[t.stock].buy += parseInt(t.quantity);
    } else {
      portfolio[t.stock].sell += parseInt(t.quantity);
    }
  });

  const container = document.getElementById("portfolio");
  container.innerHTML = "";

  // Table UI
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
        <td style="color:${pl >= 0 ? 'lightgreen' : 'red'}">
          ${pl}
        </td>
      </tr>
    `;
  }

  html += "</table>";

  container.innerHTML = html;
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
} // ✅ IMPORTANT: THIS CLOSES loadChartPage


/* MOST BOUGHT */
async function loadMostBought() {
  const trades = await contract.methods.getAllTrades().call(); // ✅ GLOBAL

  const count = {};

  trades.forEach(t => {
    if (t.isBuy) {
      if (!count[t.stock]) count[t.stock] = 0;
      count[t.stock] += parseInt(t.quantity);
    }
  });

  const sorted = Object.entries(count)
    .sort((a, b) => b[1] - a[1]);

  const container = document.getElementById("popular");
  container.innerHTML = "";

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
function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}
