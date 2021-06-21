const mongoose = require("mongoose")

mongoose
.connect(process.env.MONGODB_URI, {
    dbName: 'dashboard',
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Mongodb connected')
})
.catch((err) => console.log(err.message))

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to database')
})

mongoose.connection.on('error', (err) => {
    console.log(err.message)
})

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected')
})