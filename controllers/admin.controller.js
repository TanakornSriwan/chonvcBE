import { User } from ('../models/User');
import { Applicant } from ('../models/Applicant');

// ======================== User Management ========================

// แสดงรายชื่อผู้ใช้ทั้งหมด
exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// เปลี่ยน role ของผู้ใช้
exports.updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['student', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-passwordHash');

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// ลบผู้ใช้
exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

// ======================== Applicant Management ========================

// แสดงรายชื่อใบสมัครทั้งหมด
exports.listApplicants = async (req, res, next) => {
  try {
    const applicants = await Applicant.find().populate('user', 'username email');
    res.json(applicants);
  } catch (err) {
    next(err);
  }
};

// อัปเดตสถานะใบสมัคร
exports.updateApplicantStatus = async (req, res, next) => {
  try {
    const { applicantId } = req.params;
    const { status } = req.body;

    if (!['draft', 'submitted', 'pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const applicant = await Applicant.findByIdAndUpdate(
      applicantId,
      { status },
      { new: true }
    ).populate('user', 'username email');

    res.json(applicant);
  } catch (err) {
    next(err);
  }
};

// ลบใบสมัคร
exports.deleteApplicant = async (req, res, next) => {
  try {
    await Applicant.findByIdAndDelete(req.params.applicantId);
    res.json({ message: 'Applicant deleted' });
  } catch (err) {
    next(err);
  }
};
