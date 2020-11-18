require("dotenv").config();
const validUrl = require("valid-url");
const shortid = require("shortid");
const { BASEURL } = process.env;

const clicksCount = async (req, res) => {
    try {
      let sum, numberOfUrl;
  
      const aggregateSum = await Url.aggregate([
        { $group: { _id: null, amount: { $sum: "$clicks" } } },
      ]);
  
      sum = aggregateSum[0].amount;
  
      numberOfUrl = await Url.countDocuments({});
  
      res.send(
        `Total URLs shortend: ${numberOfUrl}  \n Total number of clicks : ${sum}`
      );
    } catch (error) {}
}

const getShortUrl = async (req, res) => {
try {
    const { longurl } = req.body;

    const baseurl = BASEURL;

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
    return res.render("../views/url", {
        url: oldurl,
        message: "",
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

    return res.render("../views/url", {
        url: newurl2,
        message: "",
    });
    }
} catch (error) {
    console.log(error);
    return res.status(500).json(error);
}
}

const getAllUrls = async (req, res) => {
    try {
      const urls = await Url.find().sort({ date: -1 }).limit(200);

      return res.render("../views/archive", {
        urls: urls,
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
}

const redirectToOriginalUrl = async (req, res) => {
    try {
      const url = await Url.findOne({ code: req.params.code });
  
      if (url) {
        if (!validUrl.isUri(url.shorturl)) {
          return res.send("Invalid short url");
        }
        var newvalues = { $set: { clicks: url.clicks + 1 } };
  
        Url.findOneAndUpdate(
          { code: req.params.code },
          newvalues,
          async (err, data) => {
            if (err) return res.send("Error");
          }
        );
  
        res.redirect(url.longurl);
      } else {
        return res.render("../views/errorpage");
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  module.exports = {
    clicksCount,
    getShortUrl,
    getAllUrls,
    redirectToOriginalUrl
  }