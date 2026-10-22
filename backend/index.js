import 'dotenv/config';

import express from 'express';
const app = express();
import Connection from './db/conn.js'
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';

const port = process.env.PORT

Connection()

app.use(cookieParser())
app.use(express.json())
app.use("/api/product", productRouter)
app.use("/api/user", userRouter)
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})


// http://localhost:8000/api/product/create-product