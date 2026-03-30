// ฝั่ง Backend
const addCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, minOrder, expiryDate } = req.body;
        // เช็คว่าค่าเหล่านี้มีค่าครบไหม (ลอง console.log ดูใน terminal)
        console.log(req.body); 

        const newCoupon = new couponModel({
            code,
            discountType,
            discountValue,
            minOrder,
            expiryDate
        });
        await newCoupon.save();
        res.json({ success: true, message: "เพิ่มสำเร็จ" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}