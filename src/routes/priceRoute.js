const express = require("express")
const router = express.Router();
const Stock = require("../model/priceModel");


router.route("/create").post((req, res) => {
    const title = req.body.title
    const content = req.body.content
    const newStock = new Stock({
        title,
        content
    })
    newStock.save();
})

module.exports = router