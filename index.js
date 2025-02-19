const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Simple Job Task");
});

app.listen(port, () => {
  console.log(`Simple Job Task is running on PORT ${port}`);
});
