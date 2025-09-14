require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

let urls = {};
let id = 1;

app.post("/api/shorturl", (req, res) => {
  let originalUrl = req.body.url;

  try {
    // Validate the URL
    let urlObj = new URL(originalUrl);

    // Must begin with http:// or https://
    if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
      return res.json({ error: "invalid url" });
    }

    urls[id] = originalUrl;
    res.json({ original_url: originalUrl, short_url: id });
    id++;
  } catch (err) {
    // Invalid URL (e.g. "abc123")
    res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:id", (req, res) => {
  let shortId = req.params.id;
  let originalUrl = urls[shortId];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: "No short URL found" });
  }
});

app.listen(port, "0.0.0.0", function () {
  console.log(`Listening on port ${port}`);
});
