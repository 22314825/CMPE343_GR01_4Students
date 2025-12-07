import sql from '../services/neonClient.js';

async function testDepartments() {
  console.log('\n=== Testing Department Controller ===');
  
  try {
    const testDept = {
      Department_No: 9999,
      Department_Name: 'Test Department'
    };
    
    console.log('Creating test department...');
    const created = await sql`
      INSERT INTO Department (Department_No, Department_Name)
      VALUES (${testDept.Department_No}, ${testDept.Department_Name})
      RETURNING *
    `;
    console.log('✓ Created:', created[0]);
    
    console.log('\nFetching all departments...');
    const allDepts = await sql`SELECT * FROM Department ORDER BY Department_No`;
    console.log(`✓ Found ${allDepts.length} departments`);
    
    console.log('\nFetching department by ID...');
    const byId = await sql`SELECT * FROM Department WHERE Department_No = ${testDept.Department_No}`;
    console.log('✓ Retrieved:', byId[0]);
    
    console.log('\nUpdating department...');
    const updated = await sql`
      UPDATE Department
      SET Department_Name = 'Updated Test Department'
      WHERE Department_No = ${testDept.Department_No}
      RETURNING *
    `;
    console.log('✓ Updated:', updated[0]);
    
    console.log('\nDeleting department...');
    const deleted = await sql`
      DELETE FROM Department
      WHERE Department_No = ${testDept.Department_No}
      RETURNING *
    `;
    console.log('✓ Deleted:', deleted[0]);
    
    console.log('\n✅ Department tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Department test failed:', error.message);
    return false;
  }
}

async function testInstructors() {
  console.log('\n=== Testing Instructor Controller ===');
  
  try {
    const testDept = {
      Department_No: 8888,
      Department_Name: 'Test Dept for Instructor'
    };
    
    console.log('Creating test department for instructor...');
    await sql`
      INSERT INTO Department (Department_No, Department_Name)
      VALUES (${testDept.Department_No}, ${testDept.Department_Name})
    `;
    
    const testInstructor = {
      Instructor_ID: 9999,
      I_Name: 'John',
      I_Surname: 'Doe',
      Salary: 50000.00,
      I_Age: 35,
      I_Mail: 'john.doe@test.com',
      Department_No: testDept.Department_No
    };
    
    console.log('Creating test instructor...');
    const created = await sql`
      INSERT INTO Instructor (Instructor_ID, I_Name, I_Surname, Salary, I_Age, I_Mail, Department_No)
      VALUES (${testInstructor.Instructor_ID}, ${testInstructor.I_Name}, ${testInstructor.I_Surname}, 
              ${testInstructor.Salary}, ${testInstructor.I_Age}, ${testInstructor.I_Mail}, ${testInstructor.Department_No})
      RETURNING *
    `;
    console.log('✓ Created:', created[0]);
    
    console.log('\nFetching all instructors...');
    const allInstructors = await sql`SELECT * FROM Instructor ORDER BY Instructor_ID`;
    console.log(`✓ Found ${allInstructors.length} instructors`);
    
    console.log('\nFetching instructor by ID...');
    const byId = await sql`SELECT * FROM Instructor WHERE Instructor_ID = ${testInstructor.Instructor_ID}`;
    console.log('✓ Retrieved:', byId[0]);
    
    console.log('\nUpdating instructor...');
    const updated = await sql`
      UPDATE Instructor
      SET I_Name = 'Jane', Salary = 60000.00
      WHERE Instructor_ID = ${testInstructor.Instructor_ID}
      RETURNING *
    `;
    console.log('✓ Updated:', updated[0]);
    
    console.log('\nDeleting instructor...');
    const deleted = await sql`
      DELETE FROM Instructor
      WHERE Instructor_ID = ${testInstructor.Instructor_ID}
      RETURNING *
    `;
    console.log('✓ Deleted:', deleted[0]);
    
    await sql`DELETE FROM Department WHERE Department_No = ${testDept.Department_No}`;
    
    console.log('\n✅ Instructor tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Instructor test failed:', error.message);
    return false;
  }
}

async function testStudents() {
  console.log('\n=== Testing Student Controller ===');
  
  try {
    const testDept = {
      Department_No: 7777,
      Department_Name: 'Test Dept for Student'
    };
    
    console.log('Creating test department for student...');
    await sql`
      INSERT INTO Department (Department_No, Department_Name)
      VALUES (${testDept.Department_No}, ${testDept.Department_Name})
    `;
    
    const testAdvisor = {
      Instructor_ID: 8888,
      I_Name: 'Advisor',
      I_Surname: 'Test',
      Department_No: testDept.Department_No
    };
    
    console.log('Creating test advisor...');
    await sql`
      INSERT INTO Instructor (Instructor_ID, I_Name, I_Surname, Department_No)
      VALUES (${testAdvisor.Instructor_ID}, ${testAdvisor.I_Name}, ${testAdvisor.I_Surname}, ${testAdvisor.Department_No})
    `;
    
    const testStudent = {
      Student_ID: 9999,
      S_Name: 'Alice',
      S_Surname: 'Smith',
      S_Age: 20,
      S_Email: 'alice.smith@test.com',
      Registration_Year: 2024,
      Grade: 'A',
      Department_No: testDept.Department_No,
      Advisor_ID: testAdvisor.Instructor_ID
    };
    
    console.log('Creating test student...');
    const created = await sql`
      INSERT INTO Student (Student_ID, S_Name, S_Surname, S_Age, S_Email, Registration_Year, Grade, Department_No, Advisor_ID)
      VALUES (${testStudent.Student_ID}, ${testStudent.S_Name}, ${testStudent.S_Surname}, ${testStudent.S_Age}, 
              ${testStudent.S_Email}, ${testStudent.Registration_Year}, ${testStudent.Grade}, 
              ${testStudent.Department_No}, ${testStudent.Advisor_ID})
      RETURNING *
    `;
    console.log('✓ Created:', created[0]);
    
    console.log('\nFetching all students...');
    const allStudents = await sql`SELECT * FROM Student ORDER BY Student_ID`;
    console.log(`✓ Found ${allStudents.length} students`);
    
    console.log('\nFetching student by ID...');
    const byId = await sql`SELECT * FROM Student WHERE Student_ID = ${testStudent.Student_ID}`;
    console.log('✓ Retrieved:', byId[0]);
    
    console.log('\nUpdating student...');
    const updated = await sql`
      UPDATE Student
      SET S_Name = 'Bob', Grade = 'B'
      WHERE Student_ID = ${testStudent.Student_ID}
      RETURNING *
    `;
    console.log('✓ Updated:', updated[0]);
    
    console.log('\nDeleting student...');
    const deleted = await sql`
      DELETE FROM Student
      WHERE Student_ID = ${testStudent.Student_ID}
      RETURNING *
    `;
    console.log('✓ Deleted:', deleted[0]);
    
    await sql`DELETE FROM Instructor WHERE Instructor_ID = ${testAdvisor.Instructor_ID}`;
    await sql`DELETE FROM Department WHERE Department_No = ${testDept.Department_No}`;
    
    console.log('\n✅ Student tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Student test failed:', error.message);
    return false;
  }
}

async function testCourses() {
  console.log('\n=== Testing Course Controller ===');
  
  try {
    const testDept = {
      Department_No: 6666,
      Department_Name: 'Test Dept for Course'
    };
    
    console.log('Creating test department for course...');
    await sql`
      INSERT INTO Department (Department_No, Department_Name)
      VALUES (${testDept.Department_No}, ${testDept.Department_Name})
    `;
    
    const testInstructor = {
      Instructor_ID: 7777,
      I_Name: 'Course',
      I_Surname: 'Instructor',
      Department_No: testDept.Department_No
    };
    
    console.log('Creating test instructor...');
    await sql`
      INSERT INTO Instructor (Instructor_ID, I_Name, I_Surname, Department_No)
      VALUES (${testInstructor.Instructor_ID}, ${testInstructor.I_Name}, ${testInstructor.I_Surname}, ${testInstructor.Department_No})
    `;
    
    const testCourse = {
      Course_ID: 9999,
      Course_Name: 'Test Course 101',
      Credit: 3,
      Semester: 'Fall 2024',
      Instructor_ID: testInstructor.Instructor_ID,
      Department_No: testDept.Department_No
    };
    
    console.log('Creating test course...');
    const created = await sql`
      INSERT INTO Course (Course_ID, Course_Name, Credit, Semester, Instructor_ID, Department_No)
      VALUES (${testCourse.Course_ID}, ${testCourse.Course_Name}, ${testCourse.Credit}, 
              ${testCourse.Semester}, ${testCourse.Instructor_ID}, ${testCourse.Department_No})
      RETURNING *
    `;
    console.log('✓ Created:', created[0]);
    
    console.log('\nFetching all courses...');
    const allCourses = await sql`SELECT * FROM Course ORDER BY Course_ID`;
    console.log(`✓ Found ${allCourses.length} courses`);
    
    console.log('\nFetching course by ID...');
    const byId = await sql`SELECT * FROM Course WHERE Course_ID = ${testCourse.Course_ID}`;
    console.log('✓ Retrieved:', byId[0]);
    
    console.log('\nUpdating course...');
    const updated = await sql`
      UPDATE Course
      SET Course_Name = 'Updated Test Course 101', Credit = 4
      WHERE Course_ID = ${testCourse.Course_ID}
      RETURNING *
    `;
    console.log('✓ Updated:', updated[0]);
    
    console.log('\nDeleting course...');
    const deleted = await sql`
      DELETE FROM Course
      WHERE Course_ID = ${testCourse.Course_ID}
      RETURNING *
    `;
    console.log('✓ Deleted:', deleted[0]);
    
    await sql`DELETE FROM Instructor WHERE Instructor_ID = ${testInstructor.Instructor_ID}`;
    await sql`DELETE FROM Department WHERE Department_No = ${testDept.Department_No}`;
    
    console.log('\n✅ Course tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Course test failed:', error.message);
    return false;
  }
}

async function testEnrollments() {
  console.log('\n=== Testing Enrollment Controller ===');
  
  try {
    const testDept = {
      Department_No: 5555,
      Department_Name: 'Test Dept for Enrollment'
    };
    
    console.log('Creating test department...');
    await sql`
      INSERT INTO Department (Department_No, Department_Name)
      VALUES (${testDept.Department_No}, ${testDept.Department_Name})
    `;
    
    const testInstructor = {
      Instructor_ID: 6666,
      I_Name: 'Enroll',
      I_Surname: 'Instructor',
      Department_No: testDept.Department_No
    };
    
    console.log('Creating test instructor...');
    await sql`
      INSERT INTO Instructor (Instructor_ID, I_Name, I_Surname, Department_No)
      VALUES (${testInstructor.Instructor_ID}, ${testInstructor.I_Name}, ${testInstructor.I_Surname}, ${testInstructor.Department_No})
    `;
    
    const testStudent = {
      Student_ID: 8888,
      S_Name: 'Enroll',
      S_Surname: 'Student',
      Department_No: testDept.Department_No,
      Advisor_ID: testInstructor.Instructor_ID
    };
    
    console.log('Creating test student...');
    await sql`
      INSERT INTO Student (Student_ID, S_Name, S_Surname, Department_No, Advisor_ID)
      VALUES (${testStudent.Student_ID}, ${testStudent.S_Name}, ${testStudent.S_Surname}, ${testStudent.Department_No}, ${testStudent.Advisor_ID})
    `;
    
    const testCourse = {
      Course_ID: 8888,
      Course_Name: 'Enrollment Test Course',
      Department_No: testDept.Department_No,
      Instructor_ID: testInstructor.Instructor_ID
    };
    
    console.log('Creating test course...');
    await sql`
      INSERT INTO Course (Course_ID, Course_Name, Department_No, Instructor_ID)
      VALUES (${testCourse.Course_ID}, ${testCourse.Course_Name}, ${testCourse.Department_No}, ${testCourse.Instructor_ID})
    `;
    
    const testEnrollment = {
      Enrollment_ID: 9999,
      Student_ID: testStudent.Student_ID,
      Course_ID: testCourse.Course_ID,
      Grade: 'A',
      Enrollment_Date: '2024-01-15',
      Semester: 'Fall 2024'
    };
    
    console.log('Creating test enrollment...');
    const created = await sql`
      INSERT INTO Enrollment (Enrollment_ID, Student_ID, Course_ID, Grade, Enrollment_Date, Semester)
      VALUES (${testEnrollment.Enrollment_ID}, ${testEnrollment.Student_ID}, ${testEnrollment.Course_ID}, 
              ${testEnrollment.Grade}, ${testEnrollment.Enrollment_Date}, ${testEnrollment.Semester})
      RETURNING *
    `;
    console.log('✓ Created:', created[0]);
    
    console.log('\nFetching all enrollments...');
    const allEnrollments = await sql`SELECT * FROM Enrollment ORDER BY Enrollment_ID`;
    console.log(`✓ Found ${allEnrollments.length} enrollments`);
    
    console.log('\nFetching enrollment by ID...');
    const byId = await sql`SELECT * FROM Enrollment WHERE Enrollment_ID = ${testEnrollment.Enrollment_ID}`;
    console.log('✓ Retrieved:', byId[0]);
    
    console.log('\nUpdating enrollment...');
    const updated = await sql`
      UPDATE Enrollment
      SET Grade = 'B', Semester = 'Spring 2024'
      WHERE Enrollment_ID = ${testEnrollment.Enrollment_ID}
      RETURNING *
    `;
    console.log('✓ Updated:', updated[0]);
    
    console.log('\nDeleting enrollment...');
    const deleted = await sql`
      DELETE FROM Enrollment
      WHERE Enrollment_ID = ${testEnrollment.Enrollment_ID}
      RETURNING *
    `;
    console.log('✓ Deleted:', deleted[0]);
    
    await sql`DELETE FROM Course WHERE Course_ID = ${testCourse.Course_ID}`;
    await sql`DELETE FROM Student WHERE Student_ID = ${testStudent.Student_ID}`;
    await sql`DELETE FROM Instructor WHERE Instructor_ID = ${testInstructor.Instructor_ID}`;
    await sql`DELETE FROM Department WHERE Department_No = ${testDept.Department_No}`;
    
    console.log('\n✅ Enrollment tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Enrollment test failed:', error.message);
    return false;
  }
}

async function testPayments() {
  console.log('\n=== Testing Payments Controller ===');
  
  try {
    const testDept = {
      Department_No: 4444,
      Department_Name: 'Test Dept for Payment'
    };
    
    console.log('Creating test department...');
    await sql`
      INSERT INTO Department (Department_No, Department_Name)
      VALUES (${testDept.Department_No}, ${testDept.Department_Name})
    `;
    
    const testInstructor = {
      Instructor_ID: 5555,
      I_Name: 'Payment',
      I_Surname: 'Instructor',
      Department_No: testDept.Department_No
    };
    
    console.log('Creating test instructor...');
    await sql`
      INSERT INTO Instructor (Instructor_ID, I_Name, I_Surname, Department_No)
      VALUES (${testInstructor.Instructor_ID}, ${testInstructor.I_Name}, ${testInstructor.I_Surname}, ${testInstructor.Department_No})
    `;
    
    const testStudent = {
      Student_ID: 7777,
      S_Name: 'Payment',
      S_Surname: 'Student',
      Department_No: testDept.Department_No,
      Advisor_ID: testInstructor.Instructor_ID
    };
    
    console.log('Creating test student...');
    await sql`
      INSERT INTO Student (Student_ID, S_Name, S_Surname, Department_No, Advisor_ID)
      VALUES (${testStudent.Student_ID}, ${testStudent.S_Name}, ${testStudent.S_Surname}, ${testStudent.Department_No}, ${testStudent.Advisor_ID})
    `;
    
    const testPayment = {
      Student_ID: testStudent.Student_ID,
      Payment_Status: 'Completed',
      Payment_Method: 'Credit Card',
      Payment_Date: '2024-01-15',
      Payment_Amount: 5000.00
    };
    
    console.log('Creating test payment...');
    const created = await sql`
      INSERT INTO Payments (Student_ID, Payment_Status, Payment_Method, Payment_Date, Payment_Amount)
      VALUES (${testPayment.Student_ID}, ${testPayment.Payment_Status}, ${testPayment.Payment_Method}, 
              ${testPayment.Payment_Date}, ${testPayment.Payment_Amount})
      RETURNING *
    `;
    console.log('✓ Created:', created[0]);
    
    const paymentId = created[0].payment_id;
    
    console.log('\nFetching all payments...');
    const allPayments = await sql`SELECT * FROM Payments ORDER BY Payment_ID`;
    console.log(`✓ Found ${allPayments.length} payments`);
    
    console.log('\nFetching payment by ID...');
    const byId = await sql`SELECT * FROM Payments WHERE Payment_ID = ${paymentId}`;
    console.log('✓ Retrieved:', byId[0]);
    
    console.log('\nUpdating payment...');
    const updated = await sql`
      UPDATE Payments
      SET Payment_Status = 'Pending', Payment_Amount = 6000.00
      WHERE Payment_ID = ${paymentId}
      RETURNING *
    `;
    console.log('✓ Updated:', updated[0]);
    
    console.log('\nDeleting payment...');
    const deleted = await sql`
      DELETE FROM Payments
      WHERE Payment_ID = ${paymentId}
      RETURNING *
    `;
    console.log('✓ Deleted:', deleted[0]);
    
    await sql`DELETE FROM Student WHERE Student_ID = ${testStudent.Student_ID}`;
    await sql`DELETE FROM Instructor WHERE Instructor_ID = ${testInstructor.Instructor_ID}`;
    await sql`DELETE FROM Department WHERE Department_No = ${testDept.Department_No}`;
    
    console.log('\n✅ Payment tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Payment test failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║   STARTING CONTROLLER TESTS FOR UNIVERSITY DBMS    ║');
  console.log('╚════════════════════════════════════════════════════╝');
  
  const results = {
    Department: false,
    Instructor: false,
    Student: false,
    Course: false,
    Enrollment: false,
    Payments: false
  };
  
  results.Department = await testDepartments();
  results.Instructor = await testInstructors();
  results.Student = await testStudents();
  results.Course = await testCourses();
  results.Enrollment = await testEnrollments();
  results.Payments = await testPayments();
  
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║                  TEST SUMMARY                      ║');
  console.log('╚════════════════════════════════════════════════════╝');
  
  for (const [controller, passed] of Object.entries(results)) {
    const status = passed ? '✅ PASSED' : '❌ FAILED';
    console.log(`${controller.padEnd(15)} : ${status}`);
  }
  
  const totalPassed = Object.values(results).filter(r => r).length;
  const totalTests = Object.keys(results).length;
  
  console.log('\n' + '='.repeat(54));
  console.log(`Total: ${totalPassed}/${totalTests} test suites passed`);
  console.log('='.repeat(54));
  
  process.exit(totalPassed === totalTests ? 0 : 1);
}

runAllTests();
