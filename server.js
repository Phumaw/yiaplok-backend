import express from "express"
import cors from "cors"
import 'dotenv/config'
import cookieParser from "cookie-parser"
import conn from "./config/mongodb.js"
import authRouter from "./routes/authroutes.js"
import userRouter from "./routes/userRoutes.js"

const app = express()
const port = process.env.port || 4000

conn()

app.use(express.json())
app.use(cookieParser())
// ในไฟล์หลักของ Backend (ที่คุณ import express, cors)
app.use(cors({
    origin: "https://yiaplok-stores.netlify.app", // ระบุ URL ของ Frontend คุณ (ห้ามใส่ *)
    credentials: true                // อนุญาตให้ส่ง Token/Cookie
}));

app.get('/', (req, res)=> res.send("เซิร์ฟเวอร์ทำงานปกติ"))
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

app.listen(port, ()=> console.log(`เซิร์ฟเวอร์เริ่มทำงานที่พอร์ต : ${port}`))