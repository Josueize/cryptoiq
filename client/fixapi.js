const fs = require("fs");
let content = fs.readFileSync("src/pages/Dashboard.jsx", "utf8");
content = content.replace("http://localhost:5000", "https://cryptoiq-production.up.railway.app");
fs.writeFileSync("src/pages/Dashboard.jsx", content);
console.log("API URL updated!");
