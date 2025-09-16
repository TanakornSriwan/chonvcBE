import express from 'express';                   // Express core
import cors from 'cors';                         // เปิด CORS
import morgan from 'morgan';                     // Logger HTTP

import authRoutes from './routes/auth.routes.js';             // เส้นทางเกี่ยวกับ auth
import applicantRoutes from './routes/applicant.routes.js';   // เส้นทางเกี่ยวกับ applicant
import { errorHandler } from './middlewares/errorHandler.js'; // Global error handler

const app = express();                           // สร้างอินสแตนซ์ Express app

app.use(cors());                                 // เปิด CORS ให้ทุกโดเมน (พื้นฐาน)
app.use(morgan('dev'));                          // แสดง log คำขอแบบ dev (GET /path 200 ...)
app.use(express.json({ limit: '2mb' }));         // ให้ Express parse JSON body (จำกัด 2MB)

app.get('/', (req,res) => res.json({ status: 'ok' })); // Health check endpoint

app.use('/api/auth', authRoutes);                      // เมานท์กลุ่มเส้นทาง /api/auth/*
app.use('/api/applicants', applicantRoutes);           // เมานท์กลุ่มเส้นทาง /api/applicants/*

app.use(errorHandler);                                 // Middleware จัดการ error ส่วนท้ายสุด

export default app;                                    // ส่งออก app ให้ server.js ใช้

