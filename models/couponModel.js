import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true }, // รหัสคูปอง เช่น NY2026
    discountType: { type: String, enum: ['fixed', 'percentage'], default: 'fixed' }, // ลดเป็นบาท หรือ %
    discountValue: { type: Number, required: true }, // จำนวนที่ลด
    minOrder: { type: Number, default: 0 }, // ขั้นต่ำในการใช้
    expiryDate: { type: Date, required: true }, // วันหมดอายุ
    isActive: { type: Boolean, default: true }, // สถานะเปิด/ปิดใช้งาน
    usersUsed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }] // เก็บ ID ลูกค้าที่เคยใช้แล้ว (กันใช้ซ้ำ)
}, { timestamps: true });

const couponModel = mongoose.models.coupon || mongoose.model("coupon", couponSchema);
export default couponModel;