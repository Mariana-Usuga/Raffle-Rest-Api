require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose");
const cors = require('cors')
const app = express();
const routes = require('./routes')

app.use(express.json());
app.use(cors())

mongoose.connect(
   process.env.MONGO_URI || "mongodb://localhost:27017/Raffles",
   console.log("connected succesfully")
 );
 
app.use(routes)

app.use((err, req, res, next) => {
   console.log(err)
   res.status(500).json({ error: err.message })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Listening on port ${PORT}!!`))