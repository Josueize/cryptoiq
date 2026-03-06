const fs = require("fs");
let content = fs.readFileSync("src/pages/Dashboard.jsx", "utf8");
content = content.replace("CryptoIQ ??", "CryptoIQ");
fs.writeFileSync("src/pages/Dashboard.jsx", content);
console.log("Fixed!");
