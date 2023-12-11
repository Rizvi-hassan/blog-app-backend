const express = require('express')
const connectToMongo = require('./db');
connectToMongo();

const port = 5000;

const app = express()

app.use(express.json())

app.use('/auth', require('./routes/auth'))


app.listen(port, ()=>{
    console.log(`Example app listening at http://localhost:${port}`);
})
