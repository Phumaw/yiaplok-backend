// ใน routes/paymentRoute.js
import multer from 'multer';
const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post('/submit-slip', upload.single('image'), async (req, res) => {
    try {
        const { orderId, customerName, amount, date, time } = req.body;
        const imageFile = req.file; // ไฟล์รูปที่ส่งมา

        // โค้ดสำหรับอัปโหลดขึ้น Cloudinary (สมมติว่าใช้ cloudinary)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        const newPayment = new paymentModel({
            orderId, customerName, amount, date, time, image: imageUrl
        });

        await newPayment.save();
        res.json({ success: true, message: "แจ้งชำระเงินสำเร็จ" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});