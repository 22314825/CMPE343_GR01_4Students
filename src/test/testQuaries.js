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
  // base: integer base for unique IDs
  const ids = {
    dept: base + 1,
    instr: base + 2,
    student: base + 3,
    course: base + 4,
    enrollment: base + 5,
    payment: base + 6
  };

  const res = createMockResponse();

  // Department
  await departmentController.createDepartment({ body: { Department_No: ids.dept, Department_Name: `Test Dept ${ids.dept}` } }, res);

  // Instructor
  await instructorController.createInstructor({ body: { Instructor_ID: ids.instr, I_Name: 'Test', I_Surname: `Instr${ids.instr}`, Salary: 1000.00, I_Age: 40, I_Mail: `instr${ids.instr}@test.com`, Department_No: ids.dept } }, res);

  // Student
  await studentController.createStudent({ body: { Student_ID: ids.student, S_Name: 'Test', S_Surname: `Stud${ids.student}`, S_Age: 20, S_Email: `stud${ids.student}@test.com`, Registration_Year: 2024, Grade: 'A', Department_No: ids.dept, Advisor_ID: ids.instr } }, res);

  // Course
  await courseController.createCourse({ body: { Course_ID: ids.course, Course_Name: `Course ${ids.course}`, Credit: 3, Semester: 'Fall 2024', Instructor_ID: ids.instr, Department_No: ids.dept } }, res);

  // Enrollment
  await enrollmentController.createEnrollment({ body: { Enrollment_ID: ids.enrollment, Student_ID: ids.student, Course_ID: ids.course, Grade: 'A', Enrollment_Date: '2024-01-15', Semester: 'Fall 2024' } }, res);

  // Payment
  await paymentsController.createPayment({ body: { Student_ID: ids.student, Payment_Status: 'Completed', Payment_Method: 'Card', Payment_Date: new Date().toISOString().split('T')[0], Payment_Amount: 1000.00 } }, res);

  return ids;
}

async function cleanupBasicEntities(ids) {
  // Use direct SQL deletes for cleanup to ensure removal
  try {
    if (!ids) return;
    await sql`DELETE FROM Enrollment WHERE Enrollment_ID = ${ids.enrollment}`;
    await sql`DELETE FROM Payments WHERE Student_ID = ${ids.student}`;
    await sql`DELETE FROM Course WHERE Course_ID = ${ids.course}`;
    await sql`DELETE FROM Student WHERE Student_ID = ${ids.student}`;
    await sql`DELETE FROM Instructor WHERE Instructor_ID = ${ids.instr}`;
    await sql`DELETE FROM Department WHERE Department_No = ${ids.dept}`;
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
