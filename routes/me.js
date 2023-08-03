const express = require("express");
const router = express.Router();
const axios = require("axios");
// add middleware
const { ensureAuthenticated } = require("../middleware/ensureAuthenticated");

router.get("/", ensureAuthenticated, (req, res) => {
  const user = req.user;
  const access_token = user.access_token;

  const website = axios.create({
    baseURL: "https://www.trade2win.com/api/",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  website
    .get("/", {})
    .then((response) => {
      const userData = response.data.me; // adjust according to actual response structure
      res.render("pages/me", { user: userData });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred while fetching user details");
    });
});

module.exports = router;
