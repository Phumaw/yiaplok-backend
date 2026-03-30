import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: 'ไม่ได้เข้าสู่ระบบ กรุณาเข้าสู่ระบบอีกครั้ง' });
    }

    try {
        // ถอดรหัส Token
        const tokenDecode = jwt.verify(token, process.env.jwt_secret);

        if (tokenDecode.id) {
            req.body.userId = tokenDecode.id; // ส่ง ID ไปให้ Controller ใช้งานต่อ
        } else {
            return res.json({ success: false, message: 'Token ไม่ถูกต้อง' });
        }

        next(); // อนุญาตให้ไปที่ Controller ตัวถัดไป

    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
}

export default userAuth;