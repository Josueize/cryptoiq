const fs = require("fs");
let content = fs.readFileSync("src/pages/Dashboard.jsx", "utf8");
content = content.replace("const [selectedCoin, setSelectedCoin] = useState(\"bitcoin\");", "const [selectedCoin, setSelectedCoin] = useState(\"BTC\");");
fs.writeFileSync("src/pages/Dashboard.jsx", content);
console.log("Dashboard fixed!");
