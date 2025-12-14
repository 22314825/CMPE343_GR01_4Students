const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let controllers = null;

// Load ES modules dynamically
async function loadControllers() {
  const module = await import('./controllersBridge.mjs');
  return {
    departmentController: module.departmentController,
    instructorController: module.instructorController,
    studentController: module.studentController,
    courseController: module.courseController,
    enrollmentController: module.enrollmentController,
    paymentsController: module.paymentsController,
    quariesController: module.quariesController
  };
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, 'index.html'));
  win.webContents.openDevTools();
}

app.whenReady().then(async () => {
  controllers = await loadControllers();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Mock response object
function createMockResponse(event, channel) {
  return {
    statusCode: 200,
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      event.sender.send(channel, { statusCode: this.statusCode, data });
      return this;
    }
  };
}

// ========== DEPARTMENTS ==========
ipcMain.on('department:getAll', async (event) => {
  const res = createMockResponse(event, 'department:getAll:response');
  await controllers.departmentController.getAllDepartments({}, res);
});

ipcMain.on('department:create', async (event, data) => {
  const res = createMockResponse(event, 'department:create:response');
  await controllers.departmentController.createDepartment({ body: data }, res);
});

ipcMain.on('department:update', async (event, { id, data }) => {
  const res = createMockResponse(event, 'department:update:response');
  await controllers.departmentController.updateDepartment({ params: { id }, body: data }, res);
});

ipcMain.on('department:delete', async (event, id) => {
  const res = createMockResponse(event, 'department:delete:response');
  await controllers.departmentController.deleteDepartment({ params: { id } }, res);
});

// ========== INSTRUCTORS ==========
ipcMain.on('instructor:getAll', async (event) => {
  const res = createMockResponse(event, 'instructor:getAll:response');
  await controllers.instructorController.getAllInstructors({}, res);
});

ipcMain.on('instructor:create', async (event, data) => {
  const res = createMockResponse(event, 'instructor:create:response');
  await controllers.instructorController.createInstructor({ body: data }, res);
});

ipcMain.on('instructor:update', async (event, { id, data }) => {
  const res = createMockResponse(event, 'instructor:update:response');
  await controllers.instructorController.updateInstructor({ params: { id }, body: data }, res);
});

ipcMain.on('instructor:delete', async (event, id) => {
  const res = createMockResponse(event, 'instructor:delete:response');
  await controllers.instructorController.deleteInstructor({ params: { id } }, res);
});

// ========== STUDENTS ==========
ipcMain.on('student:getAll', async (event) => {
  const res = createMockResponse(event, 'student:getAll:response');
  await controllers.studentController.getAllStudents({}, res);
});

ipcMain.on('student:create', async (event, data) => {
  const res = createMockResponse(event, 'student:create:response');
  await controllers.studentController.createStudent({ body: data }, res);
});

ipcMain.on('student:update', async (event, { id, data }) => {
  const res = createMockResponse(event, 'student:update:response');
  await controllers.studentController.updateStudent({ params: { id }, body: data }, res);
});

ipcMain.on('student:delete', async (event, id) => {
  const res = createMockResponse(event, 'student:delete:response');
  await controllers.studentController.deleteStudent({ params: { id } }, res);
});

// ========== COURSES ==========
ipcMain.on('course:getAll', async (event) => {
  const res = createMockResponse(event, 'course:getAll:response');
  await controllers.courseController.getAllCourses({}, res);
});

ipcMain.on('course:create', async (event, data) => {
  const res = createMockResponse(event, 'course:create:response');
  await controllers.courseController.createCourse({ body: data }, res);
});

ipcMain.on('course:update', async (event, { id, data }) => {
  const res = createMockResponse(event, 'course:update:response');
  await controllers.courseController.updateCourse({ params: { id }, body: data }, res);
});

ipcMain.on('course:delete', async (event, id) => {
  const res = createMockResponse(event, 'course:delete:response');
  await controllers.courseController.deleteCourse({ params: { id } }, res);
});

// ========== ENROLLMENTS ==========
ipcMain.on('enrollment:getAll', async (event) => {
  const res = createMockResponse(event, 'enrollment:getAll:response');
  await controllers.enrollmentController.getAllEnrollments({}, res);
});

ipcMain.on('enrollment:create', async (event, data) => {
  const res = createMockResponse(event, 'enrollment:create:response');
  await controllers.enrollmentController.createEnrollment({ body: data }, res);
});

ipcMain.on('enrollment:update', async (event, { id, data }) => {
  const res = createMockResponse(event, 'enrollment:update:response');
  await controllers.enrollmentController.updateEnrollment({ params: { id }, body: data }, res);
});

ipcMain.on('enrollment:delete', async (event, id) => {
  const res = createMockResponse(event, 'enrollment:delete:response');
  await controllers.enrollmentController.deleteEnrollment({ params: { id } }, res);
});

// ========== PAYMENTS ==========
ipcMain.on('payment:getAll', async (event) => {
  const res = createMockResponse(event, 'payment:getAll:response');
  await controllers.paymentsController.getAllPayments({}, res);
});

ipcMain.on('payment:create', async (event, data) => {
  const res = createMockResponse(event, 'payment:create:response');
  await controllers.paymentsController.createPayment({ body: data }, res);
});

ipcMain.on('payment:update', async (event, { id, data }) => {
  const res = createMockResponse(event, 'payment:update:response');
  await controllers.paymentsController.updatePayment({ params: { id }, body: data }, res);
});

ipcMain.on('payment:delete', async (event, id) => {
  const res = createMockResponse(event, 'payment:delete:response');
  await controllers.paymentsController.deletePayment({ params: { id } }, res);
});

// ========== QUERIES ==========
ipcMain.on('query:run', async (event, queryType) => {
  const res = createMockResponse(event, 'query:run:response');
  
  switch(queryType) {
    case 'q1': await controllers.quariesController.getTop5HighestCreditCourses(res); break;
    case 'q2': await controllers.quariesController.getCourseCountPerStudent(res); break;
    case 'q3': await controllers.quariesController.getStudentCountPerDepartment(res); break;
    case 'q4': await controllers.quariesController.getTotalPaymentPerStudent(res); break;
    case 'q5': await controllers.quariesController.getCoursesAboveAvgCredit(res); break;
    case 'q6': await controllers.quariesController.getMostEnrolledCourse(res); break;
    case 'q7': await controllers.quariesController.getRecentPayments30Days(res); break;
    case 'q8': await controllers.quariesController.getAverageCourseCreditPerDepartment(res); break;
    case 'q9': await controllers.quariesController.getStudentsSurnameEndsWithSon(res); break;
    case 'q10': await controllers.quariesController.getEnrollmentCountPerCourse(res); break;
    case 'q11': await controllers.quariesController.getStudentsNotEnrolled(res); break;
    case 'q12': await controllers.quariesController.getHighestSalaryInstructor(res); break;
    case 'q13': await controllers.quariesController.getAvgSalaryPerDepartment(res); break;
    case 'q14': await controllers.quariesController.getStudentsPaidMoreThan5000(res); break;
    case 'q15': await controllers.quariesController.getEnrollmentFormattedDates(res); break;
    default:
      event.sender.send('query:run:response', { statusCode: 400, data: { message: 'Invalid query type' } });
  }
});
