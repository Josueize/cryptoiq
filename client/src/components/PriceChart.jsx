import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function PriceChart({ history, coin }) {
  return (
    <div style={{ marginTop: "24px" }}>
      <h3 style={{ marginBottom: "12px", color: "#1e293b" }}>7-Day Price Chart — {coin}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={["auto", "auto"]} tickFormatter={(v) => "$" + v.toLocaleString()} />
          <Tooltip formatter={(value) => ["$" + value.toLocaleString(), "Price"]} />
          <Line type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PriceChart;
