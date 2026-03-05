const express = require("express");
const router = express.Router();
const { getSignal } = require("../utils/indicators");
const COINGECKO_BASE = "https://api.coingecko.com/api/v3";
router.get("/:coin", async (req, res) => {
  const coin = req.params.coin;
  try {
    const url = COINGECKO_BASE + "/coins/" + coin + "/market_chart?vs_currency=usd&days=30&interval=daily";
    const response = await fetch(url);
    const data = await response.json();
    if (!data.prices || data.prices.length === 0) {
      return res.status(404).json({ error: "No price data found" });
    }
    const prices = data.prices.map(([, price]) => price);
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
