import sql from '../../services/neonClient.js';
import { handleError, handleNotFound, handleSuccess } from '../../helpers/dbHelpers.js';

/*
  Controller functions implementing the queries listed in `migrations/quaries.sql`.
  Each function performs a read-only SQL query and returns JSON via helper functions.
*/

export async function getTop5HighestCreditCourses(res) {
  try {
    const result = await sql`
      SELECT Course_Name, Credit
      FROM Course
      ORDER BY Credit DESC
      LIMIT 5
    `;
    

    handleSuccess(res, result[0], 'Top 5 highest credit courses retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get top 5 highest credit courses');
  }
}

export async function getCourseCountPerStudent(res) {
  try {
    const result = await sql`
      SELECT s.S_Name, s.S_Surname, COUNT(e.Enrollment_ID) AS Total_Courses
      FROM Student s
      LEFT JOIN Enrollment e ON s.Student_ID = e.Student_ID
      GROUP BY s.Student_ID
    `;

    handleSuccess(res, result[0], 'Course count per student retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get course count per student');
  }
}

export async function getStudentCountPerDepartment(res) {
  try {
    const result = await sql`
      SELECT d.Department_Name, COUNT(s.Student_ID) AS Student_Count
      FROM Department d
      LEFT JOIN Student s ON d.Department_No = s.Department_No
      GROUP BY d.Department_No
    `;

    handleSuccess(res, result[0], 'Student count per department retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get student count per department');
  }
}

export async function getTotalPaymentPerStudent(res) {
  try {
    const result = await sql`
      SELECT s.S_Name, s.S_Surname, SUM(p.Payment_Amount) AS Total_Paid
      FROM Student s
      JOIN Payments p ON s.Student_ID = p.Student_ID
      GROUP BY s.Student_ID
    `;

    handleSuccess(res, result[0], 'Total payments per student retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get total payment per student');
  }
}

export async function getCoursesAboveAvgCredit(res) {
  try {
    const result = await sql`
      SELECT Course_Name, Credit
      FROM Course
      WHERE Credit > (SELECT AVG(Credit) FROM Course)
    `;

    handleSuccess(res, result[0], 'Courses above average credit retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get courses above average credit');
  }
}

export async function getMostEnrolledCourse(res) {
  try {
    const result = await sql`
      SELECT c.Course_Name, COUNT(e.Enrollment_ID) AS Total_Enrollments
      FROM Course c
      JOIN Enrollment e ON c.Course_ID = e.Course_ID
      GROUP BY c.Course_ID
      ORDER BY Total_Enrollments DESC
      LIMIT 1
    `;

    if (result.length === 0) return handleNotFound(res, 'Course');

    handleSuccess(res, result[0], 'Most enrolled course retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get most enrolled course');
  }
}

export async function getRecentPayments30Days(res) {
  try {
    const result = await sql`
      SELECT p.Payment_ID, s.S_Name, s.S_Surname, p.Payment_Date, p.Payment_Amount
      FROM Payments p
      JOIN Student s ON p.Student_ID = s.Student_ID
      WHERE p.Payment_Date >= CURRENT_DATE - INTERVAL '30 days'
    `;

    handleSuccess(res, result[0], 'Recent payments (last 30 days) retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get recent payments');
  }
}

export async function getAverageGradePerCourse(res) {
  try {
    const result = await sql`
      SELECT c.Course_Name, AVG(NULLIF(TRY_CAST(e.Grade AS INT), 0)) AS Average_Grade
      FROM Course c
      JOIN Enrollment e ON c.Course_ID = e.Course_ID
      GROUP BY c.Course_ID
    `;

    handleSuccess(res, result[0], 'Average grade per course retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get average grade per course');
  }
}

export async function getStudentsSurnameEndsWithSon(res) {
  try {
    const result = await sql`
      SELECT *
      FROM Student
      WHERE LOWER(S_Surname) LIKE '%son'
    `;

    handleSuccess(res, result[0], 'Students with surname ending with "son" retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get students by surname pattern');
  }
}

export async function getEnrollmentStatsPerCourse(res) {
  try {
    const result = await sql`
      SELECT c.Course_Name, COUNT(e.Student_ID) AS Student_Count, AVG(e.Semester) AS Avg_Semester
      FROM Course c
      JOIN Enrollment e ON c.Course_ID = e.Course_ID
      GROUP BY c.Course_ID
    `;

    handleSuccess(res, result[0], 'Enrollment stats per course retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get enrollment stats per course');
  }
}

export async function getStudentsNotEnrolled(res) {
  try {
    const result = await sql`
      SELECT S_Name, S_Surname
      FROM Student
      WHERE Student_ID NOT IN (SELECT Student_ID FROM Enrollment)
    `;

    handleSuccess(res, result[0], 'Students not enrolled in any course retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get students not enrolled');
  }
}

export async function getHighestSalaryInstructor(res) {
  try {
    const result = await sql`
      SELECT I_Name, I_Surname, Salary
      FROM Instructor
      ORDER BY Salary DESC
      LIMIT 1
    `;

    if (result.length === 0) return handleNotFound(res, 'Instructor');

    handleSuccess(res, result[0], 'Highest salary instructor retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get highest salary instructor');
  }
}

export async function getAvgSalaryPerDepartment(res) {
  try {
    const result = await sql`
      SELECT d.Department_Name, AVG(i.Salary) AS Average_Salary
      FROM Department d
      JOIN Instructor i ON d.Department_No = i.Department_No
      GROUP BY d.Department_No
    `;

    handleSuccess(res, result[0], 'Average instructor salary per department retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get average salary per department');
  }
}

export async function getStudentsPaidMoreThan5000(res) {
  try {
    const result = await sql`
      SELECT s.S_Name, s.S_Surname, SUM(p.Payment_Amount) AS Total_Payment
      FROM Student s
      JOIN Payments p ON s.Student_ID = p.Student_ID
      GROUP BY s.Student_ID
      HAVING SUM(p.Payment_Amount) > 5000
    `;

    handleSuccess(res, result, 'Students who paid more than 5000 retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get students who paid more than 5000');
  }
}

export async function getEnrollmentFormattedDates(res) {
  try {
    const result = await sql`
      SELECT s.S_Name, s.S_Surname,
             TO_CHAR(e.Enrollment_Date, 'DD Mon YYYY') AS Formatted_Date
      FROM Student s
      JOIN Enrollment e ON s.Student_ID = e.Student_ID
    `;

    handleSuccess(res, result[0], 'Enrollment formatted dates retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get enrollment formatted dates');
  }
}

export default {
  getTop5HighestCreditCourses,
  getCourseCountPerStudent,
  getStudentCountPerDepartment,
  getTotalPaymentPerStudent,
  getCoursesAboveAvgCredit,
  getMostEnrolledCourse,
  getRecentPayments30Days,
  getAverageGradePerCourse,
  getStudentsSurnameEndsWithSon,
  getEnrollmentStatsPerCourse,
  getStudentsNotEnrolled,
  getHighestSalaryInstructor,
  getAvgSalaryPerDepartment,
  getStudentsPaidMoreThan5000,
  getEnrollmentFormattedDates,
};
