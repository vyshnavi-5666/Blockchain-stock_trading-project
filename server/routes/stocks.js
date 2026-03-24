const router = require("express").Router();

const stocks = [
  { name: "Apple", price: 180 },
  { name: "Google", price: 2800 },
  { name: "Amazon", price: 3400 },
  { name: "Tesla", price: 900 },
  { name: "Microsoft", price: 310 },
  { name: "Infosys", price: 1500 },
  { name: "TCS", price: 3500 },
  { name: "Wipro", price: 450 },
  { name: "Samsung", price: 70 },
  { name: "Meta", price: 250 },
  { name: "Netflix", price: 600 },
  { name: "Nvidia", price: 900 },
  { name: "AMD", price: 120 },
  { name: "Intel", price: 40 },
  { name: "IBM", price: 130 }
];

router.get("/", (req, res) => {
  res.json(stocks);
});

module.exports = router;