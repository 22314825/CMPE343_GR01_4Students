import readline from 'readline';
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
  // Comprehensive test data setup matching testQuaries.js structure
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
  const salaries = [5000, 6500, 7200, 8500, 9000];
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
  const surnames = ['Anderson', 'Johnson', 'Nelson', 'Smith', 'Davis', 'Wilson', 'Jackson', 'Brown', 'Thompson', 'Garcia'];
  for (let i = 0; i < 10; i++) {
    const studentId = base + 200 + i;
    const deptIdx = i % 3;
    const advisorIdx = i % 5;
    
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

  // Create 8 Courses with varying credits
  const courseCredits = [2, 3, 3, 4, 4, 5, 5, 6];
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

  // Create 15 Enrollments (students enrolled in multiple courses)
  const enrollmentConfigs = [
    [0, 0], [0, 1], [0, 2],    // Student 0 in 3 courses
    [1, 1], [1, 2], [1, 3],    // Student 1 in 3 courses
    [2, 0], [2, 3], [2, 4],    // Student 2 in 3 courses
    [3, 5], [3, 6],            // Student 3 in 2 courses
    [4, 6], [4, 7],            // Student 4 in 2 courses
    [5, 7],                    // Student 5 in 1 course
    [6, 0]                     // Student 6 in 1 course
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

  // Create 12 Payments with varying amounts
  const paymentAmounts = [1000, 1500, 2000, 2500, 1000, 2000, 3000, 1500, 2000, 1000, 1500, 2000];
  const today = new Date();
  
  for (let i = 0; i < paymentAmounts.length; i++) {
    const studentIdx = i % 10;
    const daysAgo = i < 5 ? Math.floor(Math.random() * 20) : 40 + Math.floor(Math.random() * 30);
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
    ids.payments.push(i);
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
        await sql`DELETE FROM Enrollment WHERE Enrollment_ID = ${enrollId}`.catch(() => {});
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

async function testDepartments() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║        Testing Department Controller               ║');
  console.log('╚════════════════════════════════════════════════════╝');
  
  try {
    const testDept = {
      Department_No: 9999,
      Department_Name: 'Test Department'
    };
    
    const answer1 = await askQuestion('\n➤ Test CREATE Department? (Y/n): ');
    if (answer1.toLowerCase() !== 'n') {
      console.log('Creating test department...');
      const req = { body: testDept };
      const res = createMockResponse();
      await departmentController.createDepartment(req, res);
      if (res.statusCode === 201) {
        console.log('✓ Created:', res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    const answer2 = await askQuestion('\n➤ Test GET ALL Departments? (Y/n): ');
    if (answer2.toLowerCase() !== 'n') {
      console.log('Fetching all departments...');
      const req = {};
      const res = createMockResponse();
      await departmentController.getAllDepartments(req, res);
      if (res.statusCode === 200) {
        console.log(`✓ Found ${res.data.data.length} departments`);
        console.log(res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    const answer3 = await askQuestion('\n➤ Test GET Department by ID? (Y/n): ');
    if (answer3.toLowerCase() !== 'n') {
      console.log('Fetching department by ID...');
      const req = { params: { id: testDept.Department_No } };
      const res = createMockResponse();
      await departmentController.getDepartmentById(req, res);
      if (res.statusCode === 200) {
        console.log('✓ Retrieved:', res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    const answer4 = await askQuestion('\n➤ Test UPDATE Department? (Y/n): ');
    if (answer4.toLowerCase() !== 'n') {
      console.log('Updating department...');
      const req = { 
        params: { id: testDept.Department_No },
        body: { Department_Name: 'Updated Test Department' }
      };
      const res = createMockResponse();
      await departmentController.updateDepartment(req, res);
      if (res.statusCode === 200) {
        console.log('✓ Updated:', res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    const answer5 = await askQuestion('\n➤ Test DELETE Department? (Y/n): ');
    if (answer5.toLowerCase() !== 'n') {
      console.log('Deleting department...');
      const req = { params: { id: testDept.Department_No } };
      const res = createMockResponse();
      await departmentController.deleteDepartment(req, res);
      if (res.statusCode === 200) {
        console.log('✓ Deleted:', res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    console.log('\n✅ Department tests completed!');
    return true;
  } catch (error) {
    console.error('❌ Department test failed:', error.message);
    return false;
  }
}

async function testInstructors() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║        Testing Instructor Controller               ║');
  console.log('╚════════════════════════════════════════════════════╝');
  
  try {
    const testDept = {
      Department_No: 8888,
      Department_Name: 'Test Dept for Instructor'
    };
    
    console.log('\nSetting up test department for instructor...');
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
    
    const answer1 = await askQuestion('\n➤ Test CREATE Instructor? (Y/n): ');
    if (answer1.toLowerCase() !== 'n') {
      console.log('Creating test instructor...');
      const req = { body: testInstructor };
      const res = createMockResponse();
      await instructorController.createInstructor(req, res);
      if (res.statusCode === 201) {
        console.log('✓ Created:', res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    const answer2 = await askQuestion('\n➤ Test GET ALL Instructors? (Y/n): ');
    if (answer2.toLowerCase() !== 'n') {
      console.log('Fetching all instructors...');
      const req = {};
      const res = createMockResponse();
      await instructorController.getAllInstructors(req, res);
      if (res.statusCode === 200) {
        console.log(`✓ Found ${res.data.data.length} instructors`);
        console.log(res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    const answer3 = await askQuestion('\n➤ Test GET Instructor by ID? (Y/n): ');
    if (answer3.toLowerCase() !== 'n') {
      console.log('Fetching instructor by ID...');
      const req = { params: { id: testInstructor.Instructor_ID } };
      const res = createMockResponse();
      await instructorController.getInstructorById(req, res);
      if (res.statusCode === 200) {
        console.log('✓ Retrieved:', res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    const answer4 = await askQuestion('\n➤ Test UPDATE Instructor? (Y/n): ');
    if (answer4.toLowerCase() !== 'n') {
      console.log('Updating instructor...');
      const req = { 
        params: { id: testInstructor.Instructor_ID },
        body: {
          I_Name: 'Jane',
          I_Surname: 'Doe',
          Salary: 60000.00,
          I_Age: 35,
          I_Mail: 'jane.doe@test.com',
          Department_No: testDept.Department_No
        }
      };
      const res = createMockResponse();
      await instructorController.updateInstructor(req, res);
      if (res.statusCode === 200) {
        console.log('✓ Updated:', res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    const answer5 = await askQuestion('\n➤ Test DELETE Instructor? (Y/n): ');
    if (answer5.toLowerCase() !== 'n') {
      console.log('Deleting instructor...');
      const req = { params: { id: testInstructor.Instructor_ID } };
      const res = createMockResponse();
      await instructorController.deleteInstructor(req, res);
      if (res.statusCode === 200) {
        console.log('✓ Deleted:', res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    await sql`DELETE FROM Department WHERE Department_No = ${testDept.Department_No}`;
    
    console.log('\n✅ Instructor tests completed!');
    return true;
  } catch (error) {
    console.error('❌ Instructor test failed:', error.message);
    return false;
  }
}

async function testStudents() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║        Testing Student Controller                  ║');
  console.log('╚════════════════════════════════════════════════════╝');
  
  try {
    const testDept = {
      Department_No: 7777,
      Department_Name: 'Test Dept for Student'
    };
    
    console.log('\nSetting up test department for student...');
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
    
    console.log('Setting up test advisor...');
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
    
    const answer1 = await askQuestion('\n➤ Test CREATE Student? (Y/n): ');
    if (answer1.toLowerCase() !== 'n') {
      console.log('Creating test student...');
      const req = { body: testStudent };
      const res = createMockResponse();
      await studentController.createStudent(req, res);
      if (res.statusCode === 201) {
        console.log('✓ Created:', res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    const answer2 = await askQuestion('\n➤ Test GET ALL Students? (Y/n): ');
    if (answer2.toLowerCase() !== 'n') {
      console.log('Fetching all students...');
      const req = {};
      const res = createMockResponse();
      await studentController.getAllStudents(req, res);
      if (res.statusCode === 200) {
        console.log(`✓ Found ${res.data.data.length} students`);
        console.log(res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    const answer3 = await askQuestion('\n➤ Test GET Student by ID? (Y/n): ');
    if (answer3.toLowerCase() !== 'n') {
      console.log('Fetching student by ID...');
      const req = { params: { id: testStudent.Student_ID } };
      const res = createMockResponse();
      await studentController.getStudentById(req, res);
      if (res.statusCode === 200) {
        console.log('✓ Retrieved:', res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    const answer4 = await askQuestion('\n➤ Test UPDATE Student? (Y/n): ');
    if (answer4.toLowerCase() !== 'n') {
      console.log('Updating student...');
      const req = { 
        params: { id: testStudent.Student_ID },
        body: {
          S_Name: 'Bob',
          S_Surname: 'Smith',
          S_Age: 20,
          S_Email: 'bob.smith@test.com',
          Registration_Year: 2024,
          Grade: 'B',
          Department_No: testDept.Department_No,
          Advisor_ID: testAdvisor.Instructor_ID
        }
      };
      const res = createMockResponse();
      await studentController.updateStudent(req, res);
      if (res.statusCode === 200) {
        console.log('✓ Updated:', res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    const answer5 = await askQuestion('\n➤ Test DELETE Student? (Y/n): ');
    if (answer5.toLowerCase() !== 'n') {
      console.log('Deleting student...');
      const req = { params: { id: testStudent.Student_ID } };
      const res = createMockResponse();
      await studentController.deleteStudent(req, res);
      if (res.statusCode === 200) {
        console.log('✓ Deleted:', res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    await sql`DELETE FROM Instructor WHERE Instructor_ID = ${testAdvisor.Instructor_ID}`;
    await sql`DELETE FROM Department WHERE Department_No = ${testDept.Department_No}`;
    
    console.log('\n✅ Student tests completed!');
    return true;
  } catch (error) {
    console.error('❌ Student test failed:', error.message);
    return false;
  }
}

async function testCourses() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║        Testing Course Controller                   ║');
  console.log('╚════════════════════════════════════════════════════╝');
  
  try {
    const testDept = {
      Department_No: 6666,
      Department_Name: 'Test Dept for Course'
    };
    
    console.log('\nSetting up test department for course...');
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
    
    console.log('Setting up test instructor...');
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
    
    const answer1 = await askQuestion('\n➤ Test CREATE Course? (Y/n): ');
    if (answer1.toLowerCase() !== 'n') {
      console.log('Creating test course...');
      const req = { body: testCourse };
      const res = createMockResponse();
      await courseController.createCourse(req, res);
      if (res.statusCode === 201) {
        console.log('✓ Created:', res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    const answer2 = await askQuestion('\n➤ Test GET ALL Courses? (Y/n): ');
    if (answer2.toLowerCase() !== 'n') {
      console.log('Fetching all courses...');
      const req = {};
      const res = createMockResponse();
      await courseController.getAllCourses(req, res);
      if (res.statusCode === 200) {
        console.log(`✓ Found ${res.data.data.length} courses`);
        console.log(res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    const answer3 = await askQuestion('\n➤ Test GET Course by ID? (Y/n): ');
    if (answer3.toLowerCase() !== 'n') {
      console.log('Fetching course by ID...');
      const req = { params: { id: testCourse.Course_ID } };
      const res = createMockResponse();
      await courseController.getCourseById(req, res);
      if (res.statusCode === 200) {
        console.log('✓ Retrieved:', res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    const answer4 = await askQuestion('\n➤ Test UPDATE Course? (Y/n): ');
    if (answer4.toLowerCase() !== 'n') {
      console.log('Updating course...');
      const req = { 
        params: { id: testCourse.Course_ID },
        body: {
          Course_Name: 'Updated Test Course 101',
          Credit: 4,
          Semester: 'Spring 2024',
          Instructor_ID: testInstructor.Instructor_ID,
          Department_No: testDept.Department_No
        }
      };
      const res = createMockResponse();
      await courseController.updateCourse(req, res);
      if (res.statusCode === 200) {
        console.log('✓ Updated:', res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    const answer5 = await askQuestion('\n➤ Test DELETE Course? (Y/n): ');
    if (answer5.toLowerCase() !== 'n') {
      console.log('Deleting course...');
      const req = { params: { id: testCourse.Course_ID } };
      const res = createMockResponse();
      await courseController.deleteCourse(req, res);
      if (res.statusCode === 200) {
        console.log('✓ Deleted:', res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    await sql`DELETE FROM Instructor WHERE Instructor_ID = ${testInstructor.Instructor_ID}`;
    await sql`DELETE FROM Department WHERE Department_No = ${testDept.Department_No}`;
    
    console.log('\n✅ Course tests completed!');
    return true;
  } catch (error) {
    console.error('❌ Course test failed:', error.message);
    return false;
  }
}

async function testEnrollments() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║        Testing Enrollment Controller              ║');
  console.log('╚════════════════════════════════════════════════════╝');
  
  try {
    const testDept = {
      Department_No: 5555,
      Department_Name: 'Test Dept for Enrollment'
    };
    
    console.log('\nSetting up test department...');
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
    
    console.log('Setting up test instructor...');
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
    
    console.log('Setting up test student...');
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
    
    console.log('Setting up test course...');
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
    
    const answer1 = await askQuestion('\n➤ Test CREATE Enrollment? (Y/n): ');
    if (answer1.toLowerCase() !== 'n') {
      console.log('Creating test enrollment...');
      const req = { body: testEnrollment };
      const res = createMockResponse();
      await enrollmentController.createEnrollment(req, res);
      if (res.statusCode === 201) {
        console.log('✓ Created:', res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    const answer2 = await askQuestion('\n➤ Test GET ALL Enrollments? (Y/n): ');
    if (answer2.toLowerCase() !== 'n') {
      console.log('Fetching all enrollments...');
      const req = {};
      const res = createMockResponse();
      await enrollmentController.getAllEnrollments(req, res);
      if (res.statusCode === 200) {
        console.log(`✓ Found ${res.data.data.length} enrollments`);
        console.log(res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    const answer3 = await askQuestion('\n➤ Test GET Enrollment by ID? (Y/n): ');
    if (answer3.toLowerCase() !== 'n') {
      console.log('Fetching enrollment by ID...');
      const req = { params: { id: testEnrollment.Enrollment_ID } };
      const res = createMockResponse();
      await enrollmentController.getEnrollmentById(req, res);
      if (res.statusCode === 200) {
        console.log('✓ Retrieved:', res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    const answer4 = await askQuestion('\n➤ Test UPDATE Enrollment? (Y/n): ');
    if (answer4.toLowerCase() !== 'n') {
      console.log('Updating enrollment...');
      const req = { 
        params: { id: testEnrollment.Enrollment_ID },
        body: {
          Grade: 'B',
          Enrollment_Date: '2024-01-15',
          Semester: 'Spring 2024'
        }
      };
      const res = createMockResponse();
      await enrollmentController.updateEnrollment(req, res);
      if (res.statusCode === 200) {
        console.log('✓ Updated:', res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    const answer5 = await askQuestion('\n➤ Test DELETE Enrollment? (Y/n): ');
    if (answer5.toLowerCase() !== 'n') {
      console.log('Deleting enrollment...');
      const req = { params: { id: testEnrollment.Enrollment_ID } };
      const res = createMockResponse();
      await enrollmentController.deleteEnrollment(req, res);
      if (res.statusCode === 200) {
        console.log('✓ Deleted:', res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    await sql`DELETE FROM Course WHERE Course_ID = ${testCourse.Course_ID}`;
    await sql`DELETE FROM Student WHERE Student_ID = ${testStudent.Student_ID}`;
    await sql`DELETE FROM Instructor WHERE Instructor_ID = ${testInstructor.Instructor_ID}`;
    await sql`DELETE FROM Department WHERE Department_No = ${testDept.Department_No}`;
    
    console.log('\n✅ Enrollment tests completed!');
    return true;
  } catch (error) {
    console.error('❌ Enrollment test failed:', error.message);
    return false;
  }
}

async function testPayments() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║        Testing Payments Controller                ║');
  console.log('╚════════════════════════════════════════════════════╝');
  
  try {
    const testDept = {
      Department_No: 4444,
      Department_Name: 'Test Dept for Payment'
    };
    
    console.log('\nSetting up test department...');
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
    
    console.log('Setting up test instructor...');
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
    
    console.log('Setting up test student...');
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
    
    let paymentId = null;
    
    const answer1 = await askQuestion('\n➤ Test CREATE Payment? (Y/n): ');
    if (answer1.toLowerCase() !== 'n') {
      console.log('Creating test payment...');
      const req = { body: testPayment };
      const res = createMockResponse();
      await paymentsController.createPayment(req, res);
      if (res.statusCode === 201) {
        console.log('✓ Created:', res.data.data);
        paymentId = res.data.data.payment_id;
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    const answer2 = await askQuestion('\n➤ Test GET ALL Payments? (Y/n): ');
    if (answer2.toLowerCase() !== 'n') {
      console.log('Fetching all payments...');
      const req = {};
      const res = createMockResponse();
      await paymentsController.getAllPayments(req, res);
      if (res.statusCode === 200) {
        console.log(`✓ Found ${res.data.data.length} payments`);
        console.log(res.data.data);
        if (!paymentId && res.data.data.length > 0) {
          paymentId = res.data.data[res.data.data.length - 1].payment_id;
        }
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    const answer3 = await askQuestion('\n➤ Test GET Payment by ID? (Y/n): ');
    if (answer3.toLowerCase() !== 'n' && paymentId) {
      console.log('Fetching payment by ID...');
      const req = { params: { id: paymentId } };
      const res = createMockResponse();
      await paymentsController.getPaymentById(req, res);
      if (res.statusCode === 200) {
        console.log('✓ Retrieved:', res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    const answer4 = await askQuestion('\n➤ Test UPDATE Payment? (Y/n): ');
    if (answer4.toLowerCase() !== 'n' && paymentId) {
      console.log('Updating payment...');
      const req = { 
        params: { id: paymentId },
        body: {
          Student_ID: testStudent.Student_ID,
          Payment_Status: 'Pending',
          Payment_Method: 'Bank Transfer',
          Payment_Date: '2024-01-15',
          Payment_Amount: 6000.00
        }
      };
      const res = createMockResponse();
      await paymentsController.updatePayment(req, res);
      if (res.statusCode === 200) {
        console.log('✓ Updated:', res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    const answer5 = await askQuestion('\n➤ Test DELETE Payment? (Y/n): ');
    if (answer5.toLowerCase() !== 'n' && paymentId) {
      console.log('Deleting payment...');
      const req = { params: { id: paymentId } };
      const res = createMockResponse();
      await paymentsController.deletePayment(req, res);
      if (res.statusCode === 200) {
        console.log('✓ Deleted:', res.data.data);
      } else {
        console.log('✗ Failed:', res.data);
      }
    }
    
    await sql`DELETE FROM Student WHERE Student_ID = ${testStudent.Student_ID}`;
    await sql`DELETE FROM Instructor WHERE Instructor_ID = ${testInstructor.Instructor_ID}`;
    await sql`DELETE FROM Department WHERE Department_No = ${testDept.Department_No}`;
    
    console.log('\n✅ Payment tests completed!');
    return true;
  } catch (error) {
    console.error('❌ Payment test failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║   MANUAL CONTROLLER TESTS FOR UNIVERSITY DBMS      ║');
  console.log('╚════════════════════════════════════════════════════╝');
  console.log('\nPress Enter to continue or type "n" to skip a test...\n');
  
  // Ask once at the start about comprehensive data setup
  const setupAnswer = await askQuestion('\n➤ Create comprehensive test dataset for all tests? (Y/n): ');
  let comprehensiveIds = null;
  if (setupAnswer.toLowerCase() !== 'n') {
    console.log('\n📊 Setting up comprehensive test entities...');
    comprehensiveIds = await setupBasicEntities(30000);
  }
  
  const results = {
    Department: false,
    Instructor: false,
    Student: false,
    Course: false,
    Enrollment: false,
    Payments: false
  };
  
  const testDept = await askQuestion('\n═══ Run Department Tests? (Y/n): ');
  if (testDept.toLowerCase() !== 'n') {
    results.Department = await testDepartments();
  }
  
  const testInstr = await askQuestion('\n═══ Run Instructor Tests? (Y/n): ');
  if (testInstr.toLowerCase() !== 'n') {
    results.Instructor = await testInstructors();
  }
  
  const testStud = await askQuestion('\n═══ Run Student Tests? (Y/n): ');
  if (testStud.toLowerCase() !== 'n') {
    results.Student = await testStudents();
  }
  
  const testCrs = await askQuestion('\n═══ Run Course Tests? (Y/n): ');
  if (testCrs.toLowerCase() !== 'n') {
    results.Course = await testCourses();
  }
  
  const testEnr = await askQuestion('\n═══ Run Enrollment Tests? (Y/n): ');
  if (testEnr.toLowerCase() !== 'n') {
    results.Enrollment = await testEnrollments();
  }
  
  const testPay = await askQuestion('\n═══ Run Payments Tests? (Y/n): ');
  if (testPay.toLowerCase() !== 'n') {
    results.Payments = await testPayments();
  }
  
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║                  TEST SUMMARY                      ║');
  console.log('╚════════════════════════════════════════════════════╝');
  
  for (const [controller, passed] of Object.entries(results)) {
    const status = passed ? '✅ PASSED' : '⊗ SKIPPED';
    console.log(`${controller.padEnd(15)} : ${status}`);
  }
  
  // Ask once at the end about cleanup
  if (comprehensiveIds) {
    const cleanupAnswer = await askQuestion('\n➤ Delete comprehensive test dataset after testing? (Y/n): ');
    if (cleanupAnswer.toLowerCase() !== 'n') {
      console.log('\n🧹 Cleaning up comprehensive test entities...');
      await cleanupBasicEntities(comprehensiveIds);
    }
  }
  
  console.log('\n' + '='.repeat(54));
  console.log('Testing completed! Thank you for testing.');
  console.log('='.repeat(54));
  
  rl.close();
  process.exit(0);
}

runAllTests();
