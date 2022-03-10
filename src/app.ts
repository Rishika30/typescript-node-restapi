import express,{Express} from "express";
const app: Express = express();
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import postRoutes from "./routes/posts";
import expressValidator from "express-validator";
import {Request, Response, NextFunction} from "express";
import {AppError} from "./errorController/appError";
import {errorHandler} from "./errorController/errorHandler";

mongoose.connect(`${process.env.MONGO_URI}`)
.then(()=> console.log('DB Connected'));
mongoose.connection.on('error', err =>{
    console.log(`DB Connection error: ${err.message}`);
});

app.use(express.json());
app.use(expressValidator());
app.use("/",postRoutes);

app.all("*",(req:Request, res:Response, next:NextFunction)=>{
    throw new AppError(`Requested URL ${req.originalUrl} not found`, 404);
});

app.use(errorHandler);

const port= process.env.PORT;
app.listen(port, ()=>{
    console.log(`App is listening on port ${port}`);
})
