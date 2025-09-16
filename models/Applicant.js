import mongoose from 'mongoose';                           // ODM

const contactSchema = new mongoose.Schema({                // ซับสคีมา: ข้อมูลติดต่อ
  phone: String,
  email: String,
  address: String,
  province: String,
  district: String,
  zipcode: String
}, { _id: false });                                        // ปิด _id ของซับสคีมาชุดนี้ (ไม่จำเป็นต้องมี)

const educationSchema = new mongoose.Schema({              // ซับสคีมา: ประวัติการศึกษา
  level: String,        // e.g. 'ม.6'
  schoolName: String,
  gpa: Number,
  graduationYear: Number
}, { _id: true });                                         // เปิด _id (ค่า default) เพื่อแก้ทีละรายการได้

const applicantSchema = new mongoose.Schema({              // สคีมาหลัก Applicant
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },       // อ้างอิงผู้ใช้เหมือน FK
  nationalId: { type: String, index: true, unique: true, sparse: true }, // หมายเลขประชาชน
  prefix: String,                                                     // คำนำหน้า
  firstName: { type: String, required: true },                       // ชื่อ (จำเป็น)
  lastName: { type: String, required: true },                        // นามสกุล (จำเป็น)
  dob: Date,                                                         // วันเกิด
  gender: { type: String, enum: ['M','F','Other'] },                 // เพศ (รองรับ enum)
  contact: contactSchema,                                            // ฝังข้อมูลติดต่อเป็นอ็อบเจ็กต์
  education: [educationSchema],                                      // อาร์เรย์ของการศึกษา
  choices: [{ rank: Number, faculty: String, department: String }],  // อาร์เรย์ของตัวเลือกสาขา
  status: { type: String, enum: ['draft','submitted','accepted','rejected'], default: 'draft' } // สถานะใบสมัคร
}, { timestamps: true });                                            // มี createdAt/updatedAt

export const Applicant = mongoose.model('Applicant', applicantSchema); // สร้าง/ส่งออกโมเดล
