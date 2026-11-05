import 'dotenv/config';

import express from 'express';
const app = express();
import Connection from './db/conn.js'
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const port = process.env.PORT

Connection()

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL,
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api/product", productRouter)
app.use("/api/user", userRouter)
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})


// http://localhost:8000/api/product/create-product