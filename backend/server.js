const express = require("express")
const app = express();
const cors = require("cors");
const mongoose = require("mongoose")

app.use(cors());
app.use(express.json());

//connect to mongoose
mongoose.connect("mongodb+srv://mahsum:mahsum123@cluster0.vvyp8.mongodb.net/price")


//require route
app.use("/", require("../src/routes/priceRoute"))


app.listen(3001, function() {
    console.log("express server is running on port 3001")
})

