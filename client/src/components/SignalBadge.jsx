import React from "react";

function SignalBadge({ signal, explanation }) {
  const styles = {
    BUY: { background: "#16a34a", color: "white", label: "BUY" },
    SELL: { background: "#dc2626", color: "white", label: "SELL" },
    HOLD: { background: "#d97706", color: "white", label: "HOLD" },
  };
  const style = styles[signal] || styles.HOLD;
  return (
    <div style={{ marginTop: "16px" }}>
      <span style={{ background: style.background, color: style.color, padding: "6px 20px", borderRadius: "20px", fontWeight: "bold", fontSize: "18px" }}>
        {style.label}
      </span>
      <p style={{ marginTop: "10px", color: "#555", fontSize: "14px" }}>{explanation}</p>
    </div>
  );
}

export default SignalBadge;
