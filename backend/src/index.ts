import express, { Express } from "express";
import dotenv from "dotenv";
import connect from "./config/connectDB";
import cors from 'cors'

dotenv.config();
connect();
const app: Express = express();
 app.use(cors)


app.listen(8000, () => {
  console.log(`server is running on the ${8000}`);
});
