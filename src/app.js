import express from 'express';
import dotenv from 'dotenv';
import departmentRoutes from './routes/departments.js';
import instructorRoutes from './routes/instructors.js';
import studentRoutes from './routes/students.js';
import courseRoutes from './routes/courses.js';
import enrollmentRoutes from './routes/enrollments.js';
import paymentsRoutes from './routes/payments.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/departments', departmentRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/payments', paymentsRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'University DBMS API',
    endpoints: {
      departments: '/api/departments',
      instructors: '/api/instructors',
      students: '/api/students',
      courses: '/api/courses',
      enrollments: '/api/enrollments',
      payments: '/api/payments'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
