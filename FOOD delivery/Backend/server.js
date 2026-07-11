import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js';
import dns from 'dns'
import foodRouter from './routes/foodRoute.js';

dns.setServers(['1.1.1.1','8.8.8.8']);
dotenv.config();


//app config

const app = express();
const port = 4000;

//middle ware

app.use(express.json()) 
app.use(cors()) // access backend from any content

//add db connection
connectDB();

// api endpoints
app.use("/api/food",foodRouter)

app.use("/images", express.static("uploads"))




app.get("/",(req,res)=>{
   res.send("API working")
})

app.listen(port,(req,res)=>{
    console.log(`Server Started on http://localhost:${port}`)
});

