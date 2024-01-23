import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import session from 'express-session';
import { connectPassport } from './utils/Provider.js';
import userRouter from './routes/Users.js';
import orderRouter from './routes/Order.js';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { newError } from './middleware/newError.js';
import bodyParser from 'body-parser';
import Razorpay from 'razorpay'
import cors from 'cors'

const app = express();
// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const ORIGIN=process.env.FRONTEND_URL
app.use(cors({
    credentials:true,
    origin:ORIGIN,
    methods:["GET","POST","PUT","DELETE"]
}))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
        secure:true,
        httpOnly:true,
        sameSite:"none"
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(newError);
app.enable("trust proxy")

// Connect Passport
connectPassport();

// Routers
app.use('/app', userRouter);
app.use('/app', orderRouter);


const MONGODB=process.env.MONGI_URL || "GAndu h kya re"

const mongo=typeof MONGODB
app.use("/app",(req,res)=>{
    res.send(`<h1>${PORT} ${mongo} ${MONGODB}hello</h1>`)
})

// Default route


export const instance = new Razorpay({ key_id: process.env.RAZORPAY_ID, key_secret: process.env.RAZORPAY_SECRET})

// MongoDB Connection



main().catch((err) => console.log(err));
async function main() {
    try {
        await mongoose.connect(MONGODB)
        console.log(`Database connected  at${process.env.MONGI_URL}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`,`in ${process.env.NODE_ENV}`);
});

// NODE_ENV=development
