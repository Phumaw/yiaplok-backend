import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try {
        const { userId } = req.body; // ได้มาจาก userAuth middleware

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'ไม่พบผู้ใช้งาน' });
        }

        res.json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}