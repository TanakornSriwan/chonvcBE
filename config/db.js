import mongoose from 'mongoose';              // ODM

export async function connectDB(uri) {        // รับ URI จาก .env
  mongoose.set('strictQuery', true);          // ควบคุม behavior ของ query (แนะนำเปิด)
  await mongoose.connect(uri);                // เชื่อมต่อฐานข้อมูล (คืน Promise)
  console.log('MongoDB connected');           // แสดงสถานะเมื่อเชื่อมสำเร็จ
}
