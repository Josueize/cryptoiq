const express = require("express");
const router = express.Router();
const BASE = "https://min-api.cryptocompare.com/data";
const API_KEY = process.env.CRYPTOCOMPARE_API_KEY;
const COINS = [
  { id: "BTC", name: "Bitcoin" }, { id: "ETH", name: "Ethereum" },
  { id: "BNB", name: "BNB" }, { id: "XRP", name: "XRP" },
  { id: "SOL", name: "Solana" }, { id: "DOGE", name: "Dogecoin" },
  { id: "ADA", name: "Cardano" }, { id: "TRX", name: "TRON" },
  { id: "AVAX", name: "Avalanche" }, { id: "LINK", name: "Chainlink" }
];
router.get("/coins", async (req, res) => {
  try {
    const symbols = COINS.map(c => c.id).join(",");
    const url = BASE + "/pricemultifull?fsyms=" + symbols + "&tsyms=USD&api_key=" + API_KEY;
    const response = await fetch(url);
    const data = await response.json();
    const coins = COINS.map(coin => {
      const info = data.RAW && data.RAW[coin.id] && data.RAW[coin.id].USD;
      if (!info) return null;
      return {
        id: coin.id.toLowerCase(),
        name: coin.name,
        symbol: coin.id,
        image: "https://www.cryptocompare.com" + info.IMAGEURL,
        currentPrice: info.PRICE,
        priceChange24h: info.CHANGEPCT24HOUR,
        marketCap: info.MKTCAP
      };
    }).filter(Boolean);
    res.json(coins);
  } catch (error) {
    console.error("Coins route error:", error.message);
    res.status(500).json({ error: "Failed to fetch coins" });
  }
});
router.get("/prices/:coin", async (req, res) => {
  const coin = req.params.coin.toUpperCase();
  try {
    const priceUrl = BASE + "/price?fsym=" + coin + "&tsyms=USD&api_key=" + API_KEY;
    const priceResponse = await fetch(priceUrl);
    const priceData = await priceResponse.json();
    if (!priceData.USD) return res.status(404).json({ error: "Coin not found" });
    const historyUrl = BASE + "/v2/histoday?fsym=" + coin + "&tsym=USD&limit=7&api_key=" + API_KEY;
    const historyResponse = await fetch(historyUrl);
    const historyData = await historyResponse.json();
    const history = historyData.Data.Data.map(d => ({
      date: new Date(d.time * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      price: parseFloat(d.close.toFixed(2))
    }));
    const changeUrl = BASE + "/pricemultifull?fsyms=" + coin + "&tsyms=USD&api_key=" + API_KEY;
    const changeResponse = await fetch(changeUrl);
    const changeData = await changeResponse.json();
    const change24h = changeData.RAW[coin].USD.CHANGEPCT24HOUR;
    res.json({ coin, currentPrice: priceData.USD, priceChange24h: change24h, history });
  } catch (error) {
    console.error("Prices route error:", error.message);
    res.status(500).json({ error: "Failed to fetch prices" });
  }
});
module.exports = router;