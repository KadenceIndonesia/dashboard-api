const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const port = 3333
const indexRoutes = require("./routes/index")
const apiRoutes = require("./routes/api")

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.use("/", indexRoutes)
app.use("/api", apiRoutes)

app.listen(port, (req,res) => {
    console.log("connect")
})