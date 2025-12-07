import sql from '../services/neonClient.js';
import { handleError, handleNotFound, handleSuccess, handleCreated } from '../helpers/dbHelpers.js';

export async function getAllEnrollments(req, res) {
  try {
    const result = await sql`SELECT * FROM Enrollment ORDER BY Enrollment_ID`;
    handleSuccess(res, result, 'Enrollments retrieved successfully');
  } catch (error) {
    handleError(res, error, 'Failed to retrieve enrollments');
  }
}

export async function getEnrollmentById(req, res) {
  try {
    const { id } = req.params;
    const result = await sql`SELECT * FROM Enrollment WHERE Enrollment_ID = ${id}`;
    
    if (result.length === 0) {
      return handleNotFound(res, 'Enrollment');
    }
    
    handleSuccess(res, result[0], 'Enrollment retrieved successfully');
  } catch (error) {
    handleError(res, error, 'Failed to retrieve enrollment');
  }
}

export async function createEnrollment(req, res) {
  try {
    const { Enrollment_ID, Student_ID, Course_ID, Grade, Enrollment_Date, Semester } = req.body;
    
    const result = await sql`
      INSERT INTO Enrollment (Enrollment_ID, Student_ID, Course_ID, Grade, Enrollment_Date, Semester)
      VALUES (${Enrollment_ID}, ${Student_ID}, ${Course_ID}, ${Grade}, ${Enrollment_Date}, ${Semester})
      RETURNING *
    `;
    
    handleCreated(res, result[0], 'Enrollment created successfully');
  } catch (error) {
    handleError(res, error, 'Failed to create enrollment');
  }
}

export async function updateEnrollment(req, res) {
  try {
    const { id } = req.params;
    const { Grade, Enrollment_Date, Semester } = req.body;
    
    const result = await sql`
      UPDATE Enrollment
      SET Grade = ${Grade}, Enrollment_Date = ${Enrollment_Date}, Semester = ${Semester}
      WHERE Enrollment_ID = ${id}
      RETURNING *
    `;
    
    if (result.length === 0) {
      return handleNotFound(res, 'Enrollment');
    }
    
    handleSuccess(res, result[0], 'Enrollment updated successfully');
  } catch (error) {
    handleError(res, error, 'Failed to update enrollment');
  }
}

export async function deleteEnrollment(req, res) {
  try {
    const { id } = req.params;
    
    const result = await sql`
      DELETE FROM Enrollment
      WHERE Enrollment_ID = ${id}
      RETURNING *
    `;
    
    if (result.length === 0) {
      return handleNotFound(res, 'Enrollment');
    }
    
    handleSuccess(res, result[0], 'Enrollment deleted successfully');
  } catch (error) {
    handleError(res, error, 'Failed to delete enrollment');
  }
}
