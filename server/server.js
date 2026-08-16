const express=require("express")
const cors=require("cors")
const app=express()
const authRoutes=require("./routes/authRoutes")
const aiRoutes=require("./routes/aiRoutes")
const path = require('path');
const PORT=process.env.PORT||3000
const dotenv = require('dotenv');
const cookieParser=require("cookie-parser")
const connectDB=require('./config/db')
const { connect } = require("mongoose")
dotenv.config();


connectDB()
app.use(cookieParser());
app.use(cors(
    {
        origin: process.env.FRONTEND_URL || true,
        credentials: true
    }
))
app.use(express.json())
app.use('/api/auth',authRoutes)
app.use('/api/ai',aiRoutes)
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Backend is running'
    });
});
app.use((err,req,res,next)=>{
    console.error(err.stack)
})


app.listen(3000,()=>{
    console.log("App is running.")
})