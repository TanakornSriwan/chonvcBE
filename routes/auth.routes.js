import express from 'express';                // ตัวช่วยสร้าง Router
import { register, login, me } from '../controllers/auth.controller.js'; // controller auth
import { auth } from '../middlewares/auth.js'; // middleware ตรวจ token

const router = express.Router();              // สร้างอินสแตนซ์ Router

router.post('/register', register);           // POST /api/auth/register → สมัครผู้ใช้ใหม่
router.post('/login', login);                 // POST /api/auth/login → ล็อกอิน
router.get('/me', auth(true), me);            // GET /api/auth/me → ต้องมี token

export default router;                        // ส่งออก router ให้ app.js ใช้
