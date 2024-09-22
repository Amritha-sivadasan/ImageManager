import express, { Express } from "express";
import dotenv from "dotenv";
import connect from "./config/connectDB";
import cors from "cors";
import userRouter from "./router/userRoute";

dotenv.config();
connect();
const app: Express = express();
app.use(cors({origin: "http://localhost:5173",}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/',userRouter)

app.listen(8000, () => {
  console.log(`server is running on the ${8000}`);
});
