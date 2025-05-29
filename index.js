require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

let urlDB = [];
let urlId = 1;
app.post("/api/shorturl", function (req, res) {
  let original_url = req.body.url;
  if (!/^https?:\/\/.+\..+/.test(original_url)) {
    return res.json({ error: "invalid url" });
  }
  const short_url = urlId++;
  urlDB[short_url] = original_url;
  res.json({ original_url: original_url, short_url: short_url });
});

app.get("/api/shorturl/:short_url", function (req, res) {
  const short_url = parseInt(req.params.short_url, 10);
  const original_url = urlDB[short_url];
  res.redirect(original_url);
});
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
