const express = require("express");
const router = express.Router();
router.get("/:coin", async (req, res) => {
  const coin = req.params.coin;
  try {
    const newsUrl = "https://newsapi.org/v2/everything?q=" + coin + "&language=en&pageSize=10&sortBy=publishedAt&apiKey=" + process.env.NEWS_API_KEY;
    const newsResponse = await fetch(newsUrl);
    const newsData = await newsResponse.json();
    if (!newsData.articles || newsData.articles.length === 0) {
      return res.status(404).json({ error: "No news found" });
    }
    const headlines = newsData.articles.map((a, i) => (i+1) + ". " + a.title).join(" | ");
    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.CLAUDE_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 300, messages: [{ role: "user", content: "Analyze crypto headlines for " + coin + ". Return ONLY JSON with no code fences: {sentiment: bullish or bearish or neutral, score: 0 to 100, summary: 2 sentences}. Headlines: " + headlines }] }),
    });
    const claudeData = await claudeResponse.json();
    const rawText = claudeData.content[0].text.trim().replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(rawText);
    res.json({ coin, sentiment: parsed.sentiment, score: parsed.score, summary: parsed.summary, headlines: newsData.articles.slice(0,5).map(a => ({ title: a.title, url: a.url, source: a.source.name })) });
  } catch (error) {
    console.error("Sentiment route error:", error.message);
    res.status(500).json({ error: "Failed to analyze sentiment" });
  }
});
module.exports = router;