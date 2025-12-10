import readline from 'readline';
import * as quariesController from '../controllers/quaries/quariesController.js';
import * as departmentController from '../controllers/tables/departmentController.js';
import * as instructorController from '../controllers/tables/instructorController.js';
import * as studentController from '../controllers/tables/studentController.js';
import * as courseController from '../controllers/tables/courseController.js';
import * as enrollmentController from '../controllers/tables/enrollmentController.js';
import * as paymentsController from '../controllers/tables/paymentsController.js';
import sql from '../services/neonClient.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function createMockResponse() {
  return {
    statusCode: 200,
    data: null,
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      this.data = data;
      return this;
    }
  };
}

async function setupBasicEntities(base) {
  // Expanded test data setup for comprehensive query testing
  // Creates multiple departments, instructors, students, courses, enrollments, and payments
  
  const res = createMockResponse();
  
  // IDs for tracking created entities
  const ids = {
    depts: [],
    instrs: [],
    students: [],
    courses: [],
    enrollments: [],
    payments: []
  };

  // Create 3 Departments
  for (let i = 0; i < 3; i++) {
    const deptId = base + i;
    await departmentController.createDepartment(
      { body: { Department_No: deptId, Department_Name: `Department ${deptId}` } },
      res
    );
    ids.depts.push(deptId);
  }

  // Create 5 Instructors (distributed across departments)
  const salaries = [5000, 6500, 7200, 8500, 9000]; // Varying salaries for query #12, #13
  for (let i = 0; i < 5; i++) {
    const instrId = base + 100 + i;
    const deptIdx = i % 3;
    await instructorController.createInstructor(
      { body: {
        Instructor_ID: instrId,
        I_Name: 'Instructor',
        I_Surname: `Prof${instrId}`,
        Salary: salaries[i],
        I_Age: 35 + i,
        I_Mail: `prof${instrId}@university.edu`,
        Department_No: ids.depts[deptIdx]
      } },
      res
    );
    ids.instrs.push(instrId);
  }

  // Create 10 Students (distributed across departments)
  for (let i = 0; i < 10; i++) {
    const studentId = base + 200 + i;
    const deptIdx = i % 3;
    const advisorIdx = i % 5;
    // Some students end with 'son' (query #9)
    const surnames = ['Anderson', 'Johnson', 'Nelson', 'Smith', 'Davis', 'Wilson', 'Jackson', 'Brown', 'Thompson', 'Garcia'];
    
    await studentController.createStudent(
      { body: {
        Student_ID: studentId,
        S_Name: 'Student',
        S_Surname: surnames[i],
        S_Age: 19 + (i % 4),
        S_Email: `student${studentId}@university.edu`,
        Registration_Year: 2023 + (i % 2),
        Grade: 'A',
        Department_No: ids.depts[deptIdx],
        Advisor_ID: ids.instrs[advisorIdx]
      } },
      res
    );
    ids.students.push(studentId);
  }

  // Create 8 Courses with varying credits (query #1, #5)
  const courseCredits = [2, 3, 3, 4, 4, 5, 5, 6]; // Mix of credits
  const courseNames = ['Database Systems', 'Web Development', 'Data Science', 'AI Fundamentals', 
                       'Software Engineering', 'Cloud Computing', 'Mobile Apps', 'Cybersecurity'];
  for (let i = 0; i < 8; i++) {
    const courseId = base + 300 + i;
    const instrIdx = i % 5;
    const deptIdx = i % 3;
    
    await courseController.createCourse(
      { body: {
        Course_ID: courseId,
        Course_Name: courseNames[i],
        Credit: courseCredits[i],
        Semester: 'Fall 2024',
        Instructor_ID: ids.instrs[instrIdx],
        Department_No: ids.depts[deptIdx]
      } },
      res
    );
    ids.courses.push(courseId);
  }

  // Create 15 Enrollments (students enrolled in multiple courses, query #2, #6, #10)
  const enrollmentConfigs = [
    [0, 0], [0, 1], [0, 2],    // Student 0 in 3 courses
    [1, 1], [1, 2], [1, 3],    // Student 1 in 3 courses
    [2, 0], [2, 3], [2, 4],    // Student 2 in 3 courses
    [3, 5], [3, 6],            // Student 3 in 2 courses
    [4, 6], [4, 7],            // Student 4 in 2 courses
    [5, 7],                    // Student 5 in 1 course
    [6, 0],                    // Student 6 in 1 course
    // Students 7, 8, 9 have no enrollments (query #11)
  ];
  
  for (let i = 0; i < enrollmentConfigs.length; i++) {
    const [studentIdx, courseIdx] = enrollmentConfigs[i];
    const enrollId = base + 400 + i;
    
    await enrollmentController.createEnrollment(
      { body: {
        Enrollment_ID: enrollId,
        Student_ID: ids.students[studentIdx],
        Course_ID: ids.courses[courseIdx],
        Grade: 'A',
        Enrollment_Date: '2024-01-15',
        Semester: 'Fall 2024'
      } },
      res
    );
    ids.enrollments.push(enrollId);
  }

  // Create 12 Payments with varying amounts (query #4, #14)
  // Some students pay over 5000 total
  const paymentAmounts = [1000, 1500, 2000, 2500, 1000, 2000, 3000, 1500, 2000, 1000, 1500, 2000];
  const today = new Date();
  
  for (let i = 0; i < paymentAmounts.length; i++) {
    const studentIdx = i % 10;
    const daysAgo = i < 5 ? Math.floor(Math.random() * 20) : 40 + Math.floor(Math.random() * 30); // Mix recent and old
    const paymentDate = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const dateStr = paymentDate.toISOString().split('T')[0];
    
    await paymentsController.createPayment(
      { body: {
        Student_ID: ids.students[studentIdx],
        Payment_Status: 'Completed',
        Payment_Method: 'Card',
        Payment_Date: dateStr,
        Payment_Amount: paymentAmounts[i]
      } },
      res
    );
    ids.payments.push(i); // Track payment count
  }

  console.log(`✓ Created ${ids.depts.length} departments, ${ids.instrs.length} instructors, ${ids.students.length} students, ${ids.courses.length} courses, ${ids.enrollments.length} enrollments, ${ids.payments.length} payments`);
  
  return ids;
}

async function cleanupBasicEntities(ids) {
  // Use direct SQL deletes for cleanup to ensure removal
  try {
    if (!ids) return;

    // Delete all enrollments first
    if (ids.enrollments && ids.enrollments.length > 0) {
      for (const enrollId of ids.enrollments) {
        await sql`DELETE FROM Enrollment WHERE Enrollment_ID = ${ids.enrollments[enrollId] || enrollId}`.catch(() => {});
      }
    }

    // Delete all payments
    if (ids.students && ids.students.length > 0) {
      for (const studentId of ids.students) {
        await sql`DELETE FROM Payments WHERE Student_ID = ${studentId}`.catch(() => {});
      }
    }

    // Delete all courses
    if (ids.courses && ids.courses.length > 0) {
      for (const courseId of ids.courses) {
        await sql`DELETE FROM Course WHERE Course_ID = ${courseId}`.catch(() => {});
      }
    }

    // Delete all students
    if (ids.students && ids.students.length > 0) {
      for (const studentId of ids.students) {
        await sql`DELETE FROM Student WHERE Student_ID = ${studentId}`.catch(() => {});
      }
    }

    // Delete all instructors
    if (ids.instrs && ids.instrs.length > 0) {
      for (const instrId of ids.instrs) {
        await sql`DELETE FROM Instructor WHERE Instructor_ID = ${instrId}`.catch(() => {});
      }
    }

    // Delete all departments
    if (ids.depts && ids.depts.length > 0) {
      for (const deptId of ids.depts) {
        await sql`DELETE FROM Department WHERE Department_No = ${deptId}`.catch(() => {});
      }
    }

    console.log('✓ Cleanup completed');
  } catch (err) {
    console.error('Cleanup error:', err.message);
  }
}

async function runWithSetup(baseId, queryFn) {
  try {
    const setup = await askQuestion('\n➤ Create test data for this query using table controllers? (Y/n): ');
    let ids = null;
    if (setup.toLowerCase() !== 'n') {
      console.log('Setting up basic entities...');
      ids = await setupBasicEntities(baseId);
    }

    const run = await askQuestion('\n➤ Run query now? (Y/n): ');
    if (run.toLowerCase() === 'n') {
      if (ids) {
        const del = await askQuestion('\n➤ Delete test data created earlier? (Y/n): ');
        if (del.toLowerCase() !== 'n') await cleanupBasicEntities(ids);
      }
      return false;
    }

    //----------------

    const req = {};
    const res = createMockResponse();
    await queryFn(res);
    if (res.statusCode === 200) console.table(res.data.data || res.data);
    

    if (ids) {
      const delAfter = await askQuestion('\n➤ Delete test data created earlier? (Y/n): ');
      if (delAfter.toLowerCase() !== 'n') await cleanupBasicEntities(ids);
    }
    return res.statusCode === 200;
  } catch (err) {
    console.error('Error during setup/run:', err.message);
    return false;
  }
}

async function testTop5HighestCreditCourses() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║   1) Top 5 Highest Credit Courses                 ║');
  console.log('╚════════════════════════════════════════════════════╝');

    return await runWithSetup(11000, quariesController.getTop5HighestCreditCourses);
  }


async function testCourseCountPerStudent() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║   2) Course Count Per Student                      ║');
  console.log('╚════════════════════════════════════════════════════╝');

    return await runWithSetup(12000, quariesController.getCourseCountPerStudent);
  }


async function testStudentCountPerDepartment() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║   3) Student Count Per Department                  ║');
  console.log('╚════════════════════════════════════════════════════╝');

    return await runWithSetup(13000, quariesController.getStudentCountPerDepartment);
  }


async function testTotalPaymentPerStudent() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║   4) Total Payment Per Student                     ║');
  console.log('╚════════════════════════════════════════════════════╝');

    return await runWithSetup(14000, quariesController.getTotalPaymentPerStudent);
  }


async function testCoursesAboveAvgCredit() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║   5) Courses Above Average Credit                  ║');
  console.log('╚════════════════════════════════════════════════════╝');

    return await runWithSetup(15000, quariesController.getCoursesAboveAvgCredit);
  }


async function testMostEnrolledCourse() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║   6) Most Enrolled Course                          ║');
  console.log('╚════════════════════════════════════════════════════╝');

    return await runWithSetup(16000, quariesController.getMostEnrolledCourse);
  }


async function testRecentPayments30Days() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║   7) Recent Payments (30 days)                     ║');
  console.log('╚════════════════════════════════════════════════════╝');

    return await runWithSetup(17000, quariesController.getRecentPayments30Days);
  }


async function testAverageGradePerCourse() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║   8) Average Grade Per Course                      ║');
  console.log('╚════════════════════════════════════════════════════╝');

    return await runWithSetup(18000, quariesController.getAverageGradePerCourse);
  }


async function testStudentsSurnameEndsWithSon() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║   9) Students Whose Surname Ends with "son"       ║');
  console.log('╚════════════════════════════════════════════════════╝');

    return await runWithSetup(19000, quariesController.getStudentsSurnameEndsWithSon);
  }


async function testEnrollmentStatsPerCourse() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║  10) Enrollment Stats Per Course                   ║');
  console.log('╚════════════════════════════════════════════════════╝');

    return await runWithSetup(20000, quariesController.getEnrollmentStatsPerCourse);
  }


async function testStudentsNotEnrolled() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║  11) Students Not Enrolled In Any Course           ║');
  console.log('╚════════════════════════════════════════════════════╝');

    return await runWithSetup(21000, quariesController.getStudentsNotEnrolled);
  }


async function testHighestSalaryInstructor() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║  12) Highest Salary Instructor                     ║');
  console.log('╚════════════════════════════════════════════════════╝');

    return await runWithSetup(22000, quariesController.getHighestSalaryInstructor);
  }


async function testAvgSalaryPerDepartment() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║  13) Average Instructor Salary By Department       ║');
  console.log('╚════════════════════════════════════════════════════╝');

    return await runWithSetup(23000, quariesController.getAvgSalaryPerDepartment);
  }


async function testStudentsPaidMoreThan5000() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║  14) Students Who Paid More Than 5000             ║');
  console.log('╚════════════════════════════════════════════════════╝');

    return await runWithSetup(24000, quariesController.getStudentsPaidMoreThan5000);
  }


async function testEnrollmentFormattedDates() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║  15) Enrollment Formatted Dates                    ║');
  console.log('╚════════════════════════════════════════════════════╝');

    return await runWithSetup(25000, quariesController.getEnrollmentFormattedDates);
  }


async function runAllQuariesTests() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║        MANUAL QUARIES TESTS FOR UNIVERSITY DBMS    ║');
  console.log('╚════════════════════════════════════════════════════╝');
  console.log('\nPress Enter to continue or type "n" to skip a test...\n');

  const results = {
    Q1: false, Q2: false, Q3: false, Q4: false, Q5: false,
    Q6: false, Q7: false, Q8: false, Q9: false, Q10: false,
    Q11: false, Q12: false, Q13: false, Q14: false, Q15: false
  };

  results.Q1 = await testTop5HighestCreditCourses();
  results.Q2 = await testCourseCountPerStudent();
  results.Q3 = await testStudentCountPerDepartment();
  results.Q4 = await testTotalPaymentPerStudent();
  results.Q5 = await testCoursesAboveAvgCredit();
  results.Q6 = await testMostEnrolledCourse();
  results.Q7 = await testRecentPayments30Days();
  results.Q8 = await testAverageGradePerCourse();
  results.Q9 = await testStudentsSurnameEndsWithSon();
  results.Q10 = await testEnrollmentStatsPerCourse();
  results.Q11 = await testStudentsNotEnrolled();
  results.Q12 = await testHighestSalaryInstructor();
  results.Q13 = await testAvgSalaryPerDepartment();
  results.Q14 = await testStudentsPaidMoreThan5000();
  results.Q15 = await testEnrollmentFormattedDates();

  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║                  TEST SUMMARY                      ║');
  console.log('╚════════════════════════════════════════════════════╝');

  Object.entries(results).forEach(([k, v]) => {
    console.log(`${k.padEnd(4)} : ${v ? '✅ RAN' : '⊗ SKIPPED/FAILED'}`);
  });

  console.log('\nTesting completed.');
  rl.close();
  process.exit(0);
}

runAllQuariesTests();
