#  Stock Trading DApp

A blockchain-based stock trading application where users can buy and sell stocks using a smart contract. All trades are stored on-chain and organized into blocks using a Merkle tree structure.

## 🔹 Description

* Users can register and log in
* Buy and sell stocks via MetaMask
* Trades are recorded on Ethereum (Ganache)
* Portfolio and profit/loss are calculated dynamically
* Backend creates Merkle roots and blockchain-style blocks

## 📁 Main Files

<img width="937" height="606" alt="image" src="https://github.com/user-attachments/assets/d1dc8541-0073-4941-8563-c29d0f4b1019" />

## 🔗 Connections

* Frontend ↔ MetaMask ↔ Smart Contract (Web3.js)
* Backend ↔ Smart Contract (Web3.js)
* Backend ↔ MongoDB (User & stock data)

## ⚙️ Requirements

* Node.js
* MongoDB
* Ganache
* MetaMask

## ▶️ Run Project

1. Start Ganache
2. Start MongoDB
3. Run server:

   ```bash
   node server.js
   ```
4. Open:

   ```
   http://localhost:5000
   ```
