import express,{Express} from "express";
const app: Express = express();
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import postRoutes from "./routes/posts";
import expressValidator from "express-validator";

mongoose.connect(`${process.env.MONGO_URI}`)
.then(()=> console.log('DB Connected'));
mongoose.connection.on('error', err =>{
    console.log(`DB Connection error: ${err.message}`);
});

app.use(expressValidator());

app.use("/",postRoutes);


const port= 3000;
app.listen(port, ()=>{
    console.log(`App is listening on port ${port}`);
})
