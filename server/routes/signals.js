const express = require("express");
const router = express.Router();
const { getSignal } = require("../utils/indicators");
const BASE = "https://min-api.cryptocompare.com/data";
const API_KEY = process.env.CRYPTOCOMPARE_API_KEY;
router.get("/:coin", async (req, res) => {
  const coin = req.params.coin.toUpperCase();
  try {
    const url = BASE + "/v2/histoday?fsym=" + coin + "&tsym=USD&limit=30&api_key=" + API_KEY;
    const response = await fetch(url);
    const data = await response.json();
    if (!data.Data || !data.Data.Data) return res.status(404).json({ error: "No price data found" });
    const prices = data.Data.Data.map(d => d.close);
    const result = getSignal(prices);
    res.json({ coin, signal: result.signal, rsi: result.rsi, ma7: result.ma7, currentPrice: result.currentPrice, explanation: getExplanation(result) });
  } catch (error) {
    console.error("Signals route error:", error.message);
    res.status(500).json({ error: "Failed to calculate signal" });
  }
});
function getExplanation({ signal, rsi, ma7, currentPrice }) {
  if (signal === "BUY") return "RSI is " + rsi + " (oversold below 35) and price $" + currentPrice + " is below the 7-day average $" + ma7 + ", suggesting a potential buying opportunity.";
  if (signal === "SELL") return "RSI is " + rsi + " (overbought above 65) and price $" + currentPrice + " is above the 7-day average $" + ma7 + ", suggesting the asset may be overvalued.";
  return "RSI is " + rsi + " and price $" + currentPrice + " is near the 7-day average $" + ma7 + ". No strong signal detected - hold and monitor.";
}
module.exports = router;