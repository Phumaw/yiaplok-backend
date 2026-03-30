// ตัวอย่างไฟล์ controller/couponController.js
export const addCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, minOrder, expiryDate } = req.body;
        
        const newCoupon = new couponModel({
            code,
            discountType,
            discountValue,
            minOrder,
            expiryDate
        });

        await newCoupon.save();
        res.json({ success: true, message: "Coupon Added" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}