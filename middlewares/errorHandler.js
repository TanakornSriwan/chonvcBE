export function errorHandler(err, req, res, next) {    // รับ error จาก next(err)
  console.error(err);                                  // พิมพ์ error ลงคอนโซล (debug)
  const status = err.status || 500;                    // ใช้ status จาก error หรือ 500
  res.status(status).json({ message: err.message || 'Internal Server Error' }); // ส่ง JSON ตอบ
}
