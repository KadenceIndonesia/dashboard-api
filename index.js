const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const mongoose = require("mongoose")
const indexRoutes = require("./routes/index")
const apiRoutes = require("./routes/api")
const userRoutes = require("./routes/user")
const authRoutes = require("./routes/auth")
require('dotenv').config()
// require('./helpers/init_mongodb')

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(error => handleError(error));



// app.use(bodyParser.urlencoded());
app.use(bodyParser.json())
app.use(express.static("public"));
app.use("/", indexRoutes)
app.use("/api", apiRoutes)
app.use("/auth", authRoutes)


app.listen(process.env.PORT, (req,res) => {
    console.log("connect")
})