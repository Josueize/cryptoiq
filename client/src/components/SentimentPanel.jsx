import React from "react";

function SentimentPanel({ sentiment, score, summary, headlines }) {
  const colors = { bullish: "#16a34a", bearish: "#dc2626", neutral: "#d97706" };
  const color = colors[sentiment] || "#d97706";
  return (
    <div style={{ marginTop: "24px", padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
      <h3 style={{ marginBottom: "12px", color: "#1e293b" }}>AI Sentiment Analysis</h3>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <span style={{ background: color, color: "white", padding: "4px 16px", borderRadius: "20px", fontWeight: "bold", textTransform: "capitalize" }}>{sentiment}</span>
        <span style={{ color: "#64748b" }}>Score: <strong style={{ color }}>{score}/100</strong></span>
      </div>
      <div style={{ background: "#e2e8f0", borderRadius: "8px", height: "8px", marginBottom: "12px" }}>
        <div style={{ background: color, width: score + "%", height: "8px", borderRadius: "8px", transition: "width 0.5s" }} />
      </div>
      <p style={{ color: "#475569", fontSize: "14px", marginBottom: "16px" }}>{summary}</p>
      <h4 style={{ marginBottom: "8px", color: "#1e293b" }}>Latest Headlines</h4>
      {headlines && headlines.map((h, i) => (
        <a key={i} href={h.url} target="_blank" rel="noreferrer" style={{ display: "block", color: "#6366f1", fontSize: "13px", marginBottom: "6px", textDecoration: "none" }}>
          {i + 1}. {h.title} <span style={{ color: "#94a3b8" }}>— {h.source}</span>
        </a>
      ))}
    </div>
  );
}

export default SentimentPanel;
