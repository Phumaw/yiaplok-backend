import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    customerName: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    image: { type: String, required: true }, // เก็บ URL ของรูปภาพ
    status: { type: String, default: 'Pending' } // รอตรวจสอบ
}, { timestamps: true });

const paymentModel = mongoose.models.payment || mongoose.model("payment", paymentSchema);
export default paymentModel;