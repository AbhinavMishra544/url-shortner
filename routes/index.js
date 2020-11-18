const express = require("express");
const router = express();

// Utilities
const validUrl = require("valid-url");
const shortid = require("shortid");

// Models
const Url = require("../models/Url");

// Config variables
require("dotenv").config();
const { BASEURL } = process.env;

//controllers
const webView = require('../controllers/webViewController');
const urlController = require('../controllers/urlController');

/*ROUTES*/

// Home page view
router.get("/", webView.viewHomePage);

// Get total number of clicks and number of urls shortened
router.get("/clicks", urlController.clicksCount);

// Creating a new short url
router.post("/shorten", urlController.getShortUrl);

// Get all the short urls
router.get("/archive", urlController.getAllUrls);

// Redirecting to the original URL
router.get("/:code",urlController.redirectToOriginalUrl);

// Creating short url from params
router.get("/api", async (req, res) => {
  try {
    const baseurl = BASEURL;
    const longurl = req.query.longUrl;

    // checking validity of base url
    if (!validUrl.isUri(baseurl)) {
      return res.send("Invalid base url");
    }

    // checking validity of long url
    if (!validUrl.isUri(longurl)) {
      return res.send("Invalid long url");
    }

    // Check if the long url already exists in the database
    const oldurl = await Url.findOne({ longurl: longurl });

    if (oldurl) {
      return res.json({
        success: true,
        url: oldurl,
      });
    } else {
      // Generate unique short id
      const code = shortid.generate();

      // Short URL
      const shorturl = baseurl + code;

      const newUrl = new Url({
        longurl: longurl,
        code: code,
        shorturl: shorturl,
        date: new Date(),
      });

      const newurl2 = await newUrl.save();

      return res.json({
        success: true,
        shorturl: newurl2.shorturl,
      });
    }
  } catch (error) {}
});

module.exports = router;
