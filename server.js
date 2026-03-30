import express from "express"
import cors from "cors"
import 'dotenv/config'
import cookieParser from "cookie-parser"
import conn from "./config/mongodb.js"
import authRouter from "./routes/authroutes.js"
import userRouter from "./routes/userRoutes.js"

const app = express()
// Render มักจะใช้ตัวพิมพ์ใหญ่ PORT ดังนั้นควรเช็กทั้งสองแบบ
const port = process.env.PORT || process.env.port || 4000

conn()

// 1. ตั้งค่า Config ของ CORS ไว้ในตัวแปรเดียว
const corsOptions = {
    origin: "https://yiaplok-storess.netlify.app", // ตรวจสอบว่าชื่อนี้ตรงกับใน Netlify จริงๆ
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

// 2. ใช้งาน CORS Middleware
app.use(cors(corsOptions));

// 3. จัดการ Preflight Request (สำคัญมากสำหรับ Chrome/Safari)
app.options('*', cors(corsOptions));

app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => res.send("เซิร์ฟเวอร์ทำงานปกติ"))
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

app.listen(port, () => console.log(`เซิร์ฟเวอร์เริ่มทำงานที่พอร์ต : ${port}`))