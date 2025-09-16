import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import auth from '../middlewares/auth.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

// ต้องล็อกอิน + เป็น admin
router.use(auth(true), isAdmin);

// User management
router.get('/users', adminController.listUsers);
router.patch('/users/:userId/role', adminController.updateUserRole);
router.delete('/users/:userId', adminController.deleteUser);

// Applicant management
router.get('/applicants', adminController.listApplicants);
router.patch('/applicants/:applicantId/status', adminController.updateApplicantStatus);
router.delete('/applicants/:applicantId', adminController.deleteApplicant);

export default router;
