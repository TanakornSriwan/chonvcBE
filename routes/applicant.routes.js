import express from 'express';
import {
  createApplicant, listApplicants, getApplicant,
  updateApplicant, deleteApplicant, submitApplicant
} from '../controllers/applicant.controller.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

// list (staff/admin expected in real app; here basic)
router.get('/', auth(false), listApplicants);          // GET /api/applicants (optional token)

// create (authenticated optional)
router.post('/', auth(false), createApplicant);        // POST /api/applicants

router.get('/:id', auth(false), getApplicant);         // GET /api/applicants/:id
router.put('/:id', auth(false), updateApplicant);      // PUT /api/applicants/:id
router.delete('/:id', auth(false), deleteApplicant);   // DELETE /api/applicants/:id

router.post('/:id/submit', auth(false), submitApplicant); // POST /api/applicants/:id/submit

export default router;
