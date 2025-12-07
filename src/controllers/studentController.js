import sql from '../services/neonClient.js';
import { handleError, handleNotFound, handleSuccess, handleCreated } from '../helpers/dbHelpers.js';

export async function getAllStudents(req, res) {
  try {
    const result = await sql`SELECT * FROM Student ORDER BY Student_ID`;
    handleSuccess(res, result, 'Students retrieved successfully');
  } catch (error) {
    handleError(res, error, 'Failed to retrieve students');
  }
}

export async function getStudentById(req, res) {
  try {
    const { id } = req.params;
    const result = await sql`SELECT * FROM Student WHERE Student_ID = ${id}`;
    
    if (result.length === 0) {
      return handleNotFound(res, 'Student');
    }
    
    handleSuccess(res, result[0], 'Student retrieved successfully');
  } catch (error) {
    handleError(res, error, 'Failed to retrieve student');
  }
}

export async function createStudent(req, res) {
  try {
    const { Student_ID, S_Name, S_Surname, S_Age, S_Email, Registration_Year, Grade, Department_No, Advisor_ID } = req.body;
    
    const result = await sql`
      INSERT INTO Student (Student_ID, S_Name, S_Surname, S_Age, S_Email, Registration_Year, Grade, Department_No, Advisor_ID)
      VALUES (${Student_ID}, ${S_Name}, ${S_Surname}, ${S_Age}, ${S_Email}, ${Registration_Year}, ${Grade}, ${Department_No}, ${Advisor_ID})
      RETURNING *
    `;
    
    handleCreated(res, result[0], 'Student created successfully');
  } catch (error) {
    handleError(res, error, 'Failed to create student');
  }
}

export async function updateStudent(req, res) {
  try {
    const { id } = req.params;
    const { S_Name, S_Surname, S_Age, S_Email, Registration_Year, Grade, Department_No, Advisor_ID } = req.body;
    
    const result = await sql`
      UPDATE Student
      SET S_Name = ${S_Name}, S_Surname = ${S_Surname}, S_Age = ${S_Age}, 
          S_Email = ${S_Email}, Registration_Year = ${Registration_Year}, 
          Grade = ${Grade}, Department_No = ${Department_No}, Advisor_ID = ${Advisor_ID}
      WHERE Student_ID = ${id}
      RETURNING *
    `;
    
    if (result.length === 0) {
      return handleNotFound(res, 'Student');
    }
    
    handleSuccess(res, result[0], 'Student updated successfully');
  } catch (error) {
    handleError(res, error, 'Failed to update student');
  }
}

export async function deleteStudent(req, res) {
  try {
    const { id } = req.params;
    
    const result = await sql`
      DELETE FROM Student
      WHERE Student_ID = ${id}
      RETURNING *
    `;
    
    if (result.length === 0) {
      return handleNotFound(res, 'Student');
    }
    
    handleSuccess(res, result[0], 'Student deleted successfully');
  } catch (error) {
    handleError(res, error, 'Failed to delete student');
  }
}
