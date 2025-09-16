import dotenv from 'dotenv';         // โหลดแพ็กเกจ dotenv เพื่ออ่านตัวแปรจาก .env
dotenv.config();                     // เรียกใช้เพื่อให้ process.env มีค่าจากไฟล์ .env

import app from './app.js';          // นำเข้า Express app ที่ประกอบ middleware/routes
import { connectDB } from './config/db.js'; // ฟังก์ชันเชื่อม MongoDB

const PORT = process.env.PORT || 3000;  // อ่านพอร์ตจาก env ถ้าไม่มีให้ใช้ 4000

async function start() {                // ฟังก์ชัน async สำหรับบูทระบบ
  try {
    await connectDB(process.env.MONGO_URI);   // เชื่อม MongoDB (รอให้สำเร็จก่อน)
    app.listen(PORT, () => {                  // เริ่มฟังพอร์ต
      console.log(`Server listening on http://localhost:${PORT}`);
    }); 
  } catch (e) {                        // ถ้าเชื่อม DB หรือเริ่ม server ล้มเหลว
    console.error('Startup error', e); // พิมพ์ error ลงคอนโซล
    process.exit(1);                   // จบโปรเซสด้วยโค้ด 1 (ล้มเหลว)
  }
}

start();                               // เรียกเริ่มระบบ
