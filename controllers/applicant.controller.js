import { Applicant } from '../models/Applicant.js';         // โมเดล Applicant

// create applicant (auto-link to req.user if provided)
export async function createApplicant(req, res, next) {
  try {
    const payload = { ...req.body };                        // รับข้อมูลทั้งหมดจาก body
    if (req.user?.id) payload.user = req.user.id;           // ถ้ามีผู้ใช้ล็อกอิน ให้ผูกใบสมัครกับ user
    const a = new Applicant(payload);                       // สร้างเอกสารใหม่
    await a.save();                                         // บันทึกลงฐานข้อมูล
    res.status(201).json(a);                                // ตอบกลับเอกสารที่สร้าง
  } catch (e) { next(e); }
}

export async function listApplicants(req, res, next) {      // แสดงรายการ (พื้นฐาน)
  try {
    const q = req.query.q || '';                            // รองรับค้นหาชื่อ-นามสกุลแบบง่าย
    const filter = q
      ? { $or: [{ firstName: new RegExp(q,'i') }, { lastName: new RegExp(q,'i') }, { nationalId: q }] }
      : {};
    const items = await Applicant
      .find(filter)
      .populate('user','username email role')               // เติมข้อมูล user บางฟิลด์
      .sort({ createdAt: -1 })                              // ใหม่อยู่บน
      .limit(100);                                          // จำกัดผลลัพธ์ (กันพัง)
    res.json(items);
  } catch (e) { next(e); }
}

export async function getApplicant(req, res, next) {        // อ่านใบสมัครตาม id
  try {
    const app = await Applicant.findById(req.params.id).populate('user','username email role');
    if (!app) return res.status(404).json({ message: 'Not found' });
    res.json(app);
  } catch (e) { next(e); }
}

export async function updateApplicant(req, res, next) {     // อัปเดตทั้งก้อน (พื้นฐาน)
  try {
    const updated = await Applicant.findByIdAndUpdate(
      req.params.id,                                        // _id ที่จะอัปเดต
      req.body,                                             // ข้อมูลใหม่
      { new: true, runValidators: true }                    // new: true = คืนค่าใหม่, runValidators = ตรวจตาม schema
    );
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) { next(e); }
}

export async function deleteApplicant(req, res, next) {     // ลบใบสมัคร
  try {
    const del = await Applicant.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
}

export async function submitApplicant(req, res, next) {     // เปลี่ยนสถานะเป็น submitted
  try {
    const app = await Applicant.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Not found' });
    app.status = 'submitted';                                // อัปเดตสถานะ
    await app.save();                                        // บันทึก
    res.json(app);
  } catch (e) { next(e); }
}
