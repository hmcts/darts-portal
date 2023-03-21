const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "dist/darts-portal")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve("dist/darts-portal/index.html"));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
