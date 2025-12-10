import sql from '../../services/neonClient.js';
import { handleError, handleNotFound, handleSuccess, handleCreated } from '../../helpers/dbHelpers.js';

export async function getAllInstructors(req, res) {
  try {
    const result = await sql`SELECT * FROM Instructor ORDER BY Instructor_ID`;
    handleSuccess(res, result, 'Instructors retrieved successfully');
  } catch (error) {
    handleError(res, error, 'Failed to retrieve instructors');
  }
}

export async function getInstructorById(req, res) {
  try {
    const { id } = req.params;
    const result = await sql`SELECT * FROM Instructor WHERE Instructor_ID = ${id}`;
    
    if (result.length === 0) {
      return handleNotFound(res, 'Instructor');
    }
    
    handleSuccess(res, result[0], 'Instructor retrieved successfully');
  } catch (error) {
    handleError(res, error, 'Failed to retrieve instructor');
  }
}

export async function createInstructor(req, res) {
  try {
    const { Instructor_ID, I_Name, I_Surname, Salary, I_Age, I_Mail, Department_No } = req.body;
    
    const result = await sql`
      INSERT INTO Instructor (Instructor_ID, I_Name, I_Surname, Salary, I_Age, I_Mail, Department_No)
      VALUES (${Instructor_ID}, ${I_Name}, ${I_Surname}, ${Salary}, ${I_Age}, ${I_Mail}, ${Department_No})
      RETURNING *
    `;
    
    handleCreated(res, result[0], 'Instructor created successfully');
  } catch (error) {
    handleError(res, error, 'Failed to create instructor');
  }
}

export async function updateInstructor(req, res) {
  try {
    const { id } = req.params;
    const { I_Name, I_Surname, Salary, I_Age, I_Mail, Department_No } = req.body;
    
    const result = await sql`
      UPDATE Instructor
      SET I_Name = ${I_Name}, I_Surname = ${I_Surname}, Salary = ${Salary}, 
          I_Age = ${I_Age}, I_Mail = ${I_Mail}, Department_No = ${Department_No}
      WHERE Instructor_ID = ${id}
      RETURNING *
    `;
    
    if (result.length === 0) {
      return handleNotFound(res, 'Instructor');
    }
    
    handleSuccess(res, result[0], 'Instructor updated successfully');
  } catch (error) {
    handleError(res, error, 'Failed to update instructor');
  }
}

export async function deleteInstructor(req, res) {
  try {
    const { id } = req.params;
    
    const result = await sql`
      DELETE FROM Instructor
      WHERE Instructor_ID = ${id}
      RETURNING *
    `;
    
    if (result.length === 0) {
      return handleNotFound(res, 'Instructor');
    }
    
    handleSuccess(res, result[0], 'Instructor deleted successfully');
  } catch (error) {
    handleError(res, error, 'Failed to delete instructor');
  }
}
