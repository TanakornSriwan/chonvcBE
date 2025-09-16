import { User } from '../models/User.js';                    // โมเดลผู้ใช้
import jwt from 'jsonwebtoken';                              // JWT

function signToken(user) {                                   // สร้าง JWT จากผู้ใช้
  return jwt.sign(
    { id: user._id, role: user.role, username: user.username }, // payload (ห้ามใส่ข้อมูลลับ)
    process.env.JWT_SECRET,                                     // secret จาก .env
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }           // อายุ token
  );
}

export async function register(req, res, next) {              // สมัครผู้ใช้ใหม่
  try {
    const { username, email, password } = req.body;           // รับข้อมูลจาก body
    if (!username || !email || !password)                     // ตรวจฟิลด์เบื้องต้น
      return res.status(400).json({ message: 'Missing fields' });

    const exists = await User.findOne({                       // ตรวจซ้ำ username/email
      $or: [{ username }, { email }]
    });
    if (exists) return res.status(409).json({ message: 'Username or email already taken' });

    const u = new User({ username, email });                  // สร้างอินสแตนซ์ User
    await u.setPassword(password);                            // แฮ็ช password ด้วย argon2
    await u.save();                                           // บันทึกลง DB

    const token = signToken(u);                               // สร้าง token
    res.status(201).json({                                    // ส่งกลับ token + ข้อมูลผู้ใช้
      token,
      user: { id: u._id, username: u.username, email: u.email, role: u.role }
    });
  } catch (e) { next(e); }                                    // ส่งต่อให้ error handler
}

export async function login(req, res, next) {                 // ล็อกอิน
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password)
      return res.status(400).json({ message: 'Missing credentials' });

    const user = await User.findOne({                         // หา user ด้วย username หรือ email
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await user.verifyPassword(password);           // ตรวจรหัสผ่านกับ hash
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user);                            // ออก token
    res.json({                                                // ตอบกลับ token + ข้อมูลผู้ใช้
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    });
  } catch (e) { next(e); }
}

export async function me(req, res, next) {                    // ดึงข้อมูลผู้ใช้จาก token
  try {
    const userId = req.user?.id;                              // req.user มาจาก middleware auth
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(userId).select('-passwordHash'); // อย่าส่ง hash กลับ
    res.json(user);
  } catch (e) { next(e); }
}
