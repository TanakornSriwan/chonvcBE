import mongoose from 'mongoose';             // ODM
import argon2 from 'argon2';                 // ไลบรารีแฮชรหัสผ่าน

const userSchema = new mongoose.Schema({     // นิยามสคีมาผู้ใช้
  nationalId: { type: String, required: true, unique: true },
  fname: { type: String, required: true, unique: true, trim: true }, // ชื่อผู้ใช้ ห้ามซ้ำ
  lname: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true }, // อีเมล ห้ามซ้ำ
  passwordHash: { type: String, required: true },   // เก็บรหัสผ่านที่แฮชแล้ว
  role: { type: String, enum: ['applicant','staff','admin'], default: 'applicant' } // บทบาท
}, { timestamps: true });                     // เปิด createdAt/updatedAt อัตโนมัติ

// set password (hash)
userSchema.methods.setPassword = async function(plain) { // เมธอดอินสแตนซ์
  this.passwordHash = await argon2.hash(plain);          // แฮชรหัสผ่านด้วย argon2
};

// verify password
userSchema.methods.verifyPassword = async function(plain) { // ตรวจรหัสผ่านจากผู้ใช้
  try {
    return await argon2.verify(this.passwordHash, plain);   // เทียบกับ hash ที่เก็บไว้
  } catch (e) {
    return false;                                           // ถ้ามีข้อผิดพลาดให้ถือว่าไม่ผ่าน
  }
};

export const User = mongoose.model('User', userSchema);     // สร้าง/ส่งออกโมเดล
