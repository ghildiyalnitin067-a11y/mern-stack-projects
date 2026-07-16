import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

dotenv.config();

//app config
const app = express();
const port = process.env.PORT || 4000;

//middleware
app.use(express.json())
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:5174'];
app.use(cors({ origin: allowedOrigins, credentials: true }))

//add db connection
connectDB();

// api endpoints
app.use("/api/food",foodRouter)

app.use("/images", express.static("uploads"));

app.use("/api/user",userRouter);

app.use("/api/cart",cartRouter);

app.use("/api/order",orderRouter);


app.get("/",(req,res)=>{
   res.send("API working")
})

app.listen(port, '0.0.0.0', () => {
     console.log(`Server Started on port ${port}`)
});
