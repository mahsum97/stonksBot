const mongoose = require("mongoose")

const stonk = {
    stock: String,
    price: Number
}

const Stock = mongoose.model("Stock", stonk);

module.exports = Stock