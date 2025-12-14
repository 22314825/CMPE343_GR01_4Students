// Bridge file to load ES modules in CommonJS Electron main process
import * as departmentController from '../controllers/tables/departmentController.js';
import * as instructorController from '../controllers/tables/instructorController.js';
import * as studentController from '../controllers/tables/studentController.js';
import * as courseController from '../controllers/tables/courseController.js';
import * as enrollmentController from '../controllers/tables/enrollmentController.js';
import * as paymentsController from '../controllers/tables/paymentsController.js';
import * as quariesController from '../controllers/quaries/quariesController.js';

export {
  departmentController,
  instructorController,
  studentController,
  courseController,
  enrollmentController,
  paymentsController,
  quariesController
};
