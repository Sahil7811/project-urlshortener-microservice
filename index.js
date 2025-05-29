require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dns = require("dns");
const { URL } = require("url");

// Basic Configuration
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// In-memory storage
let urlDB = {};
let urlId = 1;

// POST /api/shorturl
app.post("/api/shorturl", function (req, res) {
  const inputUrl = req.body.url;

  // Validate URL using URL constructor
  let hostname;
  try {
    const parsedUrl = new URL(inputUrl);
    hostname = parsedUrl.hostname;
  } catch (err) {
    return res.json({ error: "invalid url" });
  }

  // DNS check to validate domain
  dns.lookup(hostname, (err) => {
    if (err) {
      return res.json({ error: "invalid url" });
    }

    const short_url = urlId++;
    urlDB[short_url] = inputUrl;

    res.json({ original_url: inputUrl, short_url });
  });
});

// GET /api/shorturl/:short_url
app.get("/api/shorturl/:short_url", function (req, res) {
  const short_url = parseInt(req.params.short_url, 10);
  const original_url = urlDB[short_url];

  if (!original_url) {
    return res.json({ error: "No short URL found for the given input" });
  }

  res.redirect(original_url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
