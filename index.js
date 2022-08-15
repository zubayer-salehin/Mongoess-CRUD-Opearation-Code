const express = require('express')
const app = express()
const cors = require('cors');
require("dotenv").config();
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const userRouter = require("./Router/userRouter");

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Mongoose Practice')
})

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5pmu7.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => console.log("Connection Successfull"))
    .catch((err) => console.log(err))

// Aplication Routers
app.use(userRouter);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})