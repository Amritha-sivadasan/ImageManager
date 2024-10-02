import express, { Express } from "express";
import dotenv from "dotenv";
import connect from "./config/connectDB";
import cors from "cors";
import userRouter from "./router/userRoute";
import  morgan from 'morgan'
import path from "path";
import cron from 'node-cron'
import axios from "axios";


dotenv.config();
connect();
const app: Express = express();
app.use(cors({origin: process.env.FRONT_END_URL, methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true,}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/',userRouter)

app.get('/ping', (req, res) => {
  res.send('Server is alive');
})

cron.schedule('*/5 * * * *', async () => {
  console.log('Cron job is running: Pinging the server...');

  try {
    // Ping your server to keep it alive
    const response = await axios.get(`${process.env.BACKEND_URL || 'http://localhost:8000'}/ping`);
    console.log('Ping successful:', response.status);
  } catch (error:any) {
    console.error('Error pinging the server:', error.message);
  }
});

app.listen(8000, () => {
  console.log(`server is running on the ${8000}`);
});
