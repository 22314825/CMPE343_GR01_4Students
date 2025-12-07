import sql from '../services/neonClient.js';
import { handleError, handleNotFound, handleSuccess, handleCreated } from '../helpers/dbHelpers.js';

export async function getAllCourses(req, res) {
  try {
    const result = await sql`SELECT * FROM Course ORDER BY Course_ID`;
    handleSuccess(res, result, 'Courses retrieved successfully');
  } catch (error) {
    handleError(res, error, 'Failed to retrieve courses');
  }
}

export async function getCourseById(req, res) {
  try {
    const { id } = req.params;
    const result = await sql`SELECT * FROM Course WHERE Course_ID = ${id}`;
    
    if (result.length === 0) {
      return handleNotFound(res, 'Course');
    }
    
    handleSuccess(res, result[0], 'Course retrieved successfully');
  } catch (error) {
    handleError(res, error, 'Failed to retrieve course');
  }
}

export async function createCourse(req, res) {
  try {
    const { Course_ID, Course_Name, Credit, Semester, Instructor_ID, Department_No } = req.body;
    
    const result = await sql`
      INSERT INTO Course (Course_ID, Course_Name, Credit, Semester, Instructor_ID, Department_No)
      VALUES (${Course_ID}, ${Course_Name}, ${Credit}, ${Semester}, ${Instructor_ID}, ${Department_No})
      RETURNING *
    `;
    
    handleCreated(res, result[0], 'Course created successfully');
  } catch (error) {
    handleError(res, error, 'Failed to create course');
  }
}

export async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const { Course_Name, Credit, Semester, Instructor_ID, Department_No } = req.body;
    
    const result = await sql`
      UPDATE Course
      SET Course_Name = ${Course_Name}, Credit = ${Credit}, Semester = ${Semester}, 
          Instructor_ID = ${Instructor_ID}, Department_No = ${Department_No}
      WHERE Course_ID = ${id}
      RETURNING *
    `;
    
    if (result.length === 0) {
      return handleNotFound(res, 'Course');
    }
    
    handleSuccess(res, result[0], 'Course updated successfully');
  } catch (error) {
    handleError(res, error, 'Failed to update course');
  }
}

export async function deleteCourse(req, res) {
  try {
    const { id } = req.params;
    
    const result = await sql`
      DELETE FROM Course
      WHERE Course_ID = ${id}
      RETURNING *
    `;
    
    if (result.length === 0) {
      return handleNotFound(res, 'Course');
    }
    
    handleSuccess(res, result[0], 'Course deleted successfully');
  } catch (error) {
    handleError(res, error, 'Failed to delete course');
  }
}
