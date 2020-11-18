// Config variables
require("dotenv").config();
const { BASEURL } = process.env;

const viewHomePage = async (req, res) => {
    try {
      return res.render("../views/home", { baseUrl: BASEURL });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  module.exports = {
    viewHomePage
  }