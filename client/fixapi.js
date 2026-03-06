const fs = require("fs");
let content = fs.readFileSync("src/pages/Dashboard.jsx", "utf8");
content = content.replace("https://cryptoiq-production.up.railway.app", "https://cryptoiq-production-0444.up.railway.app");
fs.writeFileSync("src/pages/Dashboard.jsx", content);
console.log("API URL updated!");
