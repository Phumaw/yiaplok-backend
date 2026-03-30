// การลงทะเบียน การเข้าสู่ระบบ และการออกจากระบบ เป็นต้น
// ขั้นตอนแรกคือการนำเข้าโมเดล User ซึ่งเป็นตัวแทนของผู้ใช้ในฐานข้อมูล
import userModel from "../models/userModel.js";
// การนำเข้าไลบรารี bcryptjs ซึ่งใช้สำหรับการเข้ารหัสในส่วนของรหัสผ่านของผู้ใช้
import bcrypt from "bcryptjs";
// นำเข้าไลบรารี jsonwebtoken
// ซึ่งใช้สำหรับการสร้างและตรวจสอบ token ที่ใช้ในการยืนยันตัวตนของผู้ใช้
// token เป็นสตริง่ที่ถูกสร้างขึ้นโดยเซิร์ฟเวอร์
// และส่งกลับไปยังไคลเอนด์หลังจากที่ผู้ใช้เข้าสู่ระบบสำเร็จ
import jwt from 'jsonwebtoken'
import transporter from "../config/nodemailer.js";

// ฟังก์ชันสำหรับการลงทะเบียนผู้ใช้ใหม่
export const register = async (req, res) => {
    const {name, email, password} = req.body

    if (!name || !email || !password) {
        return res.json({success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน'})
    }
    try {
        const existingUser = await userModel.findOne({email})

        if(existingUser){
            return res.json({ success: false, message: 'อีเมลนี้ถูกใช้งานแล้ว'})
        }

        // โดยใช้ salt rounds เป็น 10 ซึ่งเป็นค่าที่แนะนำสำหรับการเข้ารหัสของรหัสผ่านที่ปลอดภัย
        // หากใช้ค่ามากเกินไปอาจทำให้กระบวนการช้าลง
        const hashedPassword = await bcrypt.hash(password,10)

        // สร้างอินสแตนซ์ใหม่ของ userModel โดยส่งข้อมูลที่ได้รับจากผู้ใช้และรหัสผ่านที่เข้ารหัสแล้ว
        const user = new userModel({name, email, password: hashedPassword})
        await user.save() // บันทึกผู้ใช้ใหม่ลงในฐานข้อมูล

        // สร้าง token สำหรับ user ที่เพิ่มลงทะเบียนสำเร็จ และเก็บไว้ในตัวแปร token
        // jwt.sign เป็นฟังก์ชันที่ใช้ในการสร้าง token โดยรับพารามิเตอร์ดังนี้:
        // 1. payload: ข้อมูลที่ต้องการเก็บใน token ในที่นี้คือ id ของผู้ใช้
        // 2. secret: คีย์ลับที่ใช้ในการเข้ารหัส token ซึ่งควรเก็บเป็นความลับและไม่ควรเปิดเผย
        // 3. option: ตัวเลือกเพิ่มเติม เช่น expiresIn ที่กำหนดระยะเวลาหมดอายุของ token 
        const token = jwt.sign({id: user._id}, process.env.jwt_secret, {expiresIn: '7d'})

        res.cookie('token', token, { // add โทเคนลงในคุกกี้ของเบราว์เซอร์
            httpOnly: true, // ทำให้คุกกี้ไม่สามารถเข้าถึงได้จาก Client
            secure: process.env.node_env === 'production', // ทำให้คุกกี้ถูกส่งผ่านเฉพาะในโปรดักชั่น
            sameSite: process.env.node_env === 'production' ? 'none' : 'lax',
            maxAge: 7*24*60*60*1000 // กำหนดอายุของคุกกี้เป็น 7 วัน
        })

        const mailOptions = {      // เก็บค่าต่างๆในการส่งอีเมล์สำหรับการยืนยันการสมัคร
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: `ยินดีต้อนรับสู่เว็บไซต์ของเรา`,
            text: `บัญชีของคุณได้ถูกสร้างขึ้นด้วยอีเมล์: ${email}`
        }

        await transporter.sendMail(mailOptions)     //ส่งอีเมล์ รอจนกว่าจะสำเร็จ

        return res.json({
            success: true, message: 'ลงทะเบียนสำเร็จ',
            user: {name: user.name, email: user.email}
        })

    } catch (err) {
        res.json({success: false, message: err.message})
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body

    if(!email || !password){
        return res.json({success: false, message: 'กรูณากรอกอีเมลและรหัสผ่าน'})
    }
    try{
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success: false, message: 'ข้อมูลไม่ถูกต้อง'})
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success: false, message: 'ข้อมูลไม่ถูกต้อง'})
        }
        const token = jwt.sign({id: user._id}, process.env.jwt_secret,{expiresIn: '7d'})

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.node_env === 'production',
            sameSite: process.env.node_env === 'production' ? 'none' : 'lax',
            maxAge: 7*24*60*60*1000
        })

        return res.json({
            success: true, 
            message: 'เข้าสู่ระบบสำเร็จ',
            user: { name: user.name, role: user.role } // ส่ง role กลับไปด้วย
        });
    } catch (err) {
        return res.json({success: false, message: err.message})
    }
}

export const logout = async (req, res) =>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.node_env === 'production',
            sameSite: process.env.node_env === 'production' ? 'none' : 'lax'        
        })

        return res.json({success: true, message: 'ออกจากระบบสำเร็จ'})
    } catch (err) {
        return res.json({success: false, message: err.message})
    }
}