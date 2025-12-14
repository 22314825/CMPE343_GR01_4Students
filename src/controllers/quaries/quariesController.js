import sql from '../../services/neonClient.js';
import { handleError, handleNotFound, handleSuccess } from '../../helpers/dbHelpers.js';

/*
  Controller functions implementing the queries listed in `migrations/quaries.sql`.
  Each function performs a read-only SQL query and returns JSON via helper functions.
*/

// # Query 1: Get Top 5 Highest Credit Courses
export async function getTop5HighestCreditCourses(res) {
  try {
    const result = await sql`
      SELECT Course_Name, Credit
      FROM Course
      ORDER BY Credit DESC
      LIMIT 5
    `;
    

    handleSuccess(res, result, 'Top 5 highest credit courses retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get top 5 highest credit courses');
  }
}

// # Query 2: Get Top 5 Highest Credit Courses
export async function getCourseCountPerStudent(res) {
  try {
    const result = await sql`
      SELECT s.S_Name, s.S_Surname, COUNT(e.Enrollment_ID) AS Total_Courses
      FROM Student s
      LEFT JOIN Enrollment e ON s.Student_ID = e.Student_ID
      GROUP BY s.Student_ID
    `;

    handleSuccess(res, result, 'Course count per student retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get course count per student');
  }
}

// # Query 3: Get Student Count Per Department
export async function getStudentCountPerDepartment(res) {
  try {
    const result = await sql`
      SELECT d.Department_Name, COUNT(s.Student_ID) AS Student_Count
      FROM Department d
      LEFT JOIN Student s ON d.Department_No = s.Department_No
      GROUP BY d.Department_No
    `;

    handleSuccess(res, result, 'Student count per department retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get student count per department');
  }
}

// # Query 4: Get Total Payment Per Student
export async function getTotalPaymentPerStudent(res) {
  try {
    const result = await sql`
      SELECT s.S_Name, s.S_Surname, SUM(p.Payment_Amount) AS Total_Paid
      FROM Student s
      JOIN Payments p ON s.Student_ID = p.Student_ID
      GROUP BY s.Student_ID
    `;

    handleSuccess(res, result, 'Total payments per student retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get total payment per student');
  }
}

// # Query 5: Get Courses Above Average Credit
export async function getCoursesAboveAvgCredit(res) {
  try {
    const result = await sql`
      SELECT Course_Name, Credit
      FROM Course
      WHERE Credit > (SELECT AVG(Credit) FROM Course)
    `;

    handleSuccess(res, result, 'Courses above average credit retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get courses above average credit');
  }
}

// # Query 6: Get Most Enrolled Course
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

    handleSuccess(res, result, 'Most enrolled course retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get most enrolled course');
  }
}

// # Query 7: Get Recent Payments in Last 30 Days
export async function getRecentPayments30Days(res) {
  try {
    const result = await sql`
      SELECT p.Payment_ID, s.S_Name, s.S_Surname, p.Payment_Date, p.Payment_Amount
      FROM Payments p
      JOIN Student s ON p.Student_ID = s.Student_ID
      WHERE p.Payment_Date >= CURRENT_DATE - INTERVAL '30 days'
    `;

    handleSuccess(res, result, 'Recent payments (last 30 days) retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get recent payments');
  }
}

// # Query 8: Get Average Course Credit Per Department
export async function getAverageCourseCreditPerDepartment(res) {
  try {
    const result = await sql`
      SELECT d.Department_Name, AVG(c.Credit) AS Average_Credit
      FROM Department d
      JOIN Course c ON d.Department_No = c.Department_No
      GROUP BY d.Department_No
    `;

    handleSuccess(res, result, 'Average course credit per department retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get average course credit per department');
  }
}

// # Query 9: Get Students with Surname Ending with 'son'
export async function getStudentsSurnameEndsWithSon(res) {
  try {
    const result = await sql`
      SELECT *
      FROM Student
      WHERE LOWER(S_Surname) LIKE '%son'
    `;

    handleSuccess(res, result, 'Students with surname ending with "son" retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get students by surname pattern');
  }
}

// # Query 10: Get Total Enrollment Count Per Course
export async function getEnrollmentCountPerCourse(res) {
  try {
    const result = await sql`
      SELECT c.Course_Name, COUNT(e.Student_ID) AS Student_Count
      FROM Course c
      LEFT JOIN Enrollment e ON c.Course_ID = e.Course_ID
      GROUP BY c.Course_ID
    `;

    handleSuccess(res, result, 'Enrollment count per course retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get enrollment count per course');
  }
}

// # Query 11: Get Students Not Enrolled in Any Course
export async function getStudentsNotEnrolled(res) {
  try {
    const result = await sql`
      SELECT S_Name, S_Surname
      FROM Student
      WHERE Student_ID NOT IN (SELECT Student_ID FROM Enrollment)
    `;

    handleSuccess(res, result, 'Students not enrolled in any course retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get students not enrolled');
  }
}

// # Query 12: Get Highest Salary Instructor
export async function getHighestSalaryInstructor(res) {
  try {
    const result = await sql`
      SELECT I_Name, I_Surname, Salary
      FROM Instructor
      ORDER BY Salary DESC
      LIMIT 1
    `;

    if (result.length === 0) return handleNotFound(res, 'Instructor');

    handleSuccess(res, result, 'Highest salary instructor retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get highest salary instructor');
  }
}

// # Query 13: Get Average Salary Per Department
export async function getAvgSalaryPerDepartment(res) {
  try {
    const result = await sql`
      SELECT d.Department_Name, AVG(i.Salary) AS Average_Salary
      FROM Department d
      JOIN Instructor i ON d.Department_No = i.Department_No
      GROUP BY d.Department_No
    `;

    handleSuccess(res, result, 'Average instructor salary per department retrieved');
  } catch (error) {
    handleError(res, error, 'Failed to get average salary per department');
  }
}

// # Query 14: Get Students Who Paid More Than 5000
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

// # Query 15: Get Enrollment Dates Formatted
export async function getEnrollmentFormattedDates(res) {
  try {
    const result = await sql`
      SELECT s.S_Name, s.S_Surname,
             TO_CHAR(e.Enrollment_Date, 'DD Mon YYYY') AS Formatted_Date
      FROM Student s
      JOIN Enrollment e ON s.Student_ID = e.Student_ID
    `;

    handleSuccess(res, result, 'Enrollment formatted dates retrieved');
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
  getAverageCourseCreditPerDepartment,
  getStudentsSurnameEndsWithSon,
  getEnrollmentCountPerCourse,
  getStudentsNotEnrolled,
  getHighestSalaryInstructor,
  getAvgSalaryPerDepartment,
  getStudentsPaidMoreThan5000,
  getEnrollmentFormattedDates,
};
