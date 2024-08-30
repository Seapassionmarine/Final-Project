const express = require('express')
const router = require('./router/userR')
const cors = require('cors')
require('./config/dbconfig')
require ("dotenv").config()

const app = express()

app.use(express.json())
app.use(cors({origin: "*"}))  
app.use('/api/v1/user',router)

const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server connected successfully on port: ${PORT}`);
})