function calculateRSI(prices, period = 14) {
  if (prices.length < period + 1) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);
  return parseFloat(rsi.toFixed(2));
}
function calculateMA(prices, period = 7) {
  if (prices.length < period) return null;
  const slice = prices.slice(-period);
  const ma = slice.reduce((sum, p) => sum + p, 0) / period;
  return parseFloat(ma.toFixed(2));
}
function getSignal(prices) {
  const rsi = calculateRSI(prices);
  const ma7 = calculateMA(prices, 7);
  const currentPrice = prices[prices.length - 1];
  if (!ma7) return { signal: "HOLD", rsi, ma7, currentPrice };
  let signal = "HOLD";
  if (rsi < 35 && currentPrice < ma7) signal = "BUY";
  else if (rsi > 65 && currentPrice > ma7) signal = "SELL";
  return { signal, rsi, ma7, currentPrice };
}
module.exports = { calculateRSI, calculateMA, getSignal };
