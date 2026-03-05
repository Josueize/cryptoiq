require("dotenv").config();
const newsUrl = "https://newsapi.org/v2/everything?q=bitcoin&language=en&pageSize=5&sortBy=publishedAt&apiKey=" + process.env.NEWS_API_KEY;
fetch(newsUrl)
  .then(r => r.json())
  .then(newsData => {
    const headlines = newsData.articles.map((a, i) => (i+1) + ". " + a.title).join(" | ");
    return fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.CLAUDE_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 300, messages: [{ role: "user", content: "Analyze crypto headlines for bitcoin. Return ONLY JSON: {sentiment: bullish or bearish or neutral, score: 0 to 100, summary: 2 sentences}. Headlines: " + headlines }] })
    });
  })
  .then(r => r.json())
  .then(d => console.log(JSON.stringify(d, null, 2)))
  .catch(e => console.error("ERROR:", e.message));
