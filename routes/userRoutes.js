import express from 'express';
import userAuth from '../middleware/userAuth.js'; // ตัว Middleware ที่เราทำไว้ก่อนหน้านี้
import { getUserData } from '../controllers/userController.js';

const userRouter = express.Router();

// ใช้ userAuth เพื่อเช็คว่ามี Token ไหมก่อนดึงข้อมูล
userRouter.get('/data', userAuth, getUserData);

export default userRouter;