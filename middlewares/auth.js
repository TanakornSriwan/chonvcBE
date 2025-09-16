import jwt from 'jsonwebtoken';                // ไลบรารีจัดการ JWT

export function auth(required = true) {        // สร้าง middleware; required = ต้องมี token ไหม
  return (req, res, next) => {                 // คืน middleware function
    const header = req.headers.authorization || '';               // อ่าน Authorization header
    const token = header.startsWith('Bearer ') ? header.slice(7) : null; // ตัดคำว่า "Bearer "
    if (!token) {                              // ไม่มี token
      if (required) return res.status(401).json({ message: 'No token' }); // บังคับต้องมี
      req.user = null;                         // ไม่ต้องมีก็ได้ → เซ็ต user = null แล้วไปต่อ
      return next();
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);  // ตรวจ/ถอดรหัส token
      req.user = payload;                    // เก็บ payload ไว้ใช้ต่อใน controller (เช่น id, role)
      return next();                         // ผ่านไปยัง handler ถัดไป
    } catch (e) {                             // token ไม่ถูกต้อง/หมดอายุ
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}
