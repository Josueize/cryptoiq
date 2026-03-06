import React, { useState, useEffect } from "react";
import axios from "axios";
import PriceChart from "../components/PriceChart";
import SignalBadge from "../components/SignalBadge";
import SentimentPanel from "../components/SentimentPanel";
import Portfolio from "../components/Portfolio";

const API = "https://cryptoiq-production.up.railway.app";

function Dashboard() {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState("BTC");
  const [priceData, setPriceData] = useState(null);
  const [signalData, setSignalData] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(API + "/api/crypto/coins").then((res) => setCoins(res.data));
  }, []);

  useEffect(() => {
    if (!selectedCoin) return;
    setLoading(true);
    Promise.all([
      axios.get(API + "/api/crypto/prices/" + selectedCoin),
      axios.get(API + "/api/signals/" + selectedCoin),
      axios.get(API + "/api/sentiment/" + selectedCoin),
    ]).then(([price, signal, sentiment]) => {
      setPriceData(price.data);
      setSignalData(signal.data);
      setSentimentData(sentiment.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [selectedCoin]);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ margin: 0, color: "#1e293b" }}>CryptoIQ</h1>
          <p style={{ margin: 0, color: "#64748b" }}>AI-powered crypto market intelligence</p>
        </div>
        <select value={selectedCoin} onChange={(e) => setSelectedCoin(e.target.value)} style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "16px", cursor: "pointer" }}>
          {coins.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.symbol})</option>)}
        </select>
      </div>

      {loading && <p style={{ textAlign: "center", color: "#6366f1" }}>Loading data...</p>}

      {priceData && !loading && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>
          <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>Current Price</p>
            <h2 style={{ margin: 0, color: "#1e293b" }}>${priceData.currentPrice.toLocaleString()}</h2>
          </div>
          <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>24h Change</p>
            <h2 style={{ margin: 0, color: priceData.priceChange24h >= 0 ? "#16a34a" : "#dc2626" }}>
              {priceData.priceChange24h >= 0 ? "+" : ""}{priceData.priceChange24h.toFixed(2)}%
            </h2>
          </div>
          {signalData && (
            <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>RSI</p>
              <h2 style={{ margin: 0, color: "#1e293b" }}>{signalData.rsi}</h2>
            </div>
          )}
        </div>
      )}

      {priceData && !loading && <PriceChart history={priceData.history} coin={selectedCoin} />}
      {signalData && !loading && <SignalBadge signal={signalData.signal} explanation={signalData.explanation} />}
      {sentimentData && !loading && <SentimentPanel sentiment={sentimentData.sentiment} score={sentimentData.score} summary={sentimentData.summary} headlines={sentimentData.headlines} />}
      <Portfolio coins={coins} />
    </div>
  );
}

export default Dashboard;
