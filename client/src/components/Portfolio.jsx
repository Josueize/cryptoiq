import React, { useState } from "react";

function Portfolio({ coins }) {
  const [portfolio, setPortfolio] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState("");
  const [amount, setAmount] = useState("");

  const addCoin = () => {
    if (!selectedCoin || !amount) return;
    const coin = coins.find((c) => c.id === selectedCoin);
    if (!coin) return;
    const existing = portfolio.find((p) => p.id === selectedCoin);
    if (existing) {
      setPortfolio(portfolio.map((p) => p.id === selectedCoin ? { ...p, amount: parseFloat(p.amount) + parseFloat(amount) } : p));
    } else {
      setPortfolio([...portfolio, { id: coin.id, name: coin.name, symbol: coin.symbol, amount: parseFloat(amount), currentPrice: coin.currentPrice }]);
    }
    setAmount("");
  };

  const removeCoin = (id) => setPortfolio(portfolio.filter((p) => p.id !== id));

  const totalValue = portfolio.reduce((sum, p) => sum + p.amount * p.currentPrice, 0);

  return (
    <div style={{ marginTop: "24px", padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
      <h3 style={{ marginBottom: "16px", color: "#1e293b" }}>Portfolio Tracker</h3>
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
        <select value={selectedCoin} onChange={(e) => setSelectedCoin(e.target.value)} style={{ padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0", flex: 1 }}>
          <option value="">Select coin</option>
          {coins && coins.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.symbol})</option>)}
        </select>
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0", width: "120px" }} />
        <button onClick={addCoin} style={{ padding: "8px 16px", background: "#6366f1", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Add</button>
      </div>
      {portfolio.length === 0 ? (
        <p style={{ color: "#94a3b8", textAlign: "center" }}>No coins added yet</p>
      ) : (
        <>
          {portfolio.map((p) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", background: "white", borderRadius: "8px", marginBottom: "8px", border: "1px solid #e2e8f0" }}>
              <span style={{ fontWeight: "bold" }}>{p.symbol}</span>
              <span style={{ color: "#64748b" }}>{p.amount} coins</span>
              <span style={{ color: "#16a34a", fontWeight: "bold" }}>${(p.amount * p.currentPrice).toLocaleString()}</span>
              <button onClick={() => removeCoin(p.id)} style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", padding: "4px 10px", cursor: "pointer" }}>Remove</button>
            </div>
          ))}
          <div style={{ marginTop: "12px", padding: "12px", background: "#6366f1", borderRadius: "8px", color: "white", textAlign: "center" }}>
            <strong>Total Portfolio Value: ${totalValue.toLocaleString()}</strong>
          </div>
        </>
      )}
    </div>
  );
}

export default Portfolio;
