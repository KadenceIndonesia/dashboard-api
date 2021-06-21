const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const mongoose = require("mongoose")
const port = 3333
const indexRoutes = require("./routes/index")
const apiRoutes = require("./routes/api")
const userRoutes = require("./routes/user")
require('dotenv').config()
// require('./helpers/init_mongodb')

mongoose.connect('mongodb://0.0.0.0:8010/dashboard', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(error => handleError(error));



app.use(bodyParser.urlencoded());
app.use(bodyParser.json())
app.use(express.static("public"));
app.use("/", indexRoutes)
app.use("/api", apiRoutes)
app.use("/user", userRoutes)

app.listen(process.env.PORT, (req,res) => {
    console.log("connect")
})