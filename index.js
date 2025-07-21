const express = require('express')
const connectToMongo = require('./db');
const cors = require('cors');
connectToMongo();

const port = 5000;

const app = express()

app.use(express.json())
app.use(cors())

// Test route to check if the server is running
app.get('/test', (req, res)=>{
    res.status(200).json({message: "Test successful!"});
})

app.use('/auth', require('./routes/auth'));
app.use('/blog', require('./routes/blog'));



app.listen(port, ()=>{
    console.log(`Example app listening at http://localhost:${port}`);
})
