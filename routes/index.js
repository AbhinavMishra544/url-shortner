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

module.exports = router;
