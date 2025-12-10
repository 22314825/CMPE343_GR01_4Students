import sql from '../../services/neonClient.js';
import { handleError, handleNotFound, handleSuccess, handleCreated } from '../../helpers/dbHelpers.js';

export async function getAllDepartments(req, res) {
  try {
    const result = await sql`SELECT * FROM Department ORDER BY Department_No`;
    handleSuccess(res, result, 'Departments retrieved successfully');
  } catch (error) {
    handleError(res, error, 'Failed to retrieve departments');
  }
}

export async function getDepartmentById(req, res) {
  try {
    const { id } = req.params;
    const result = await sql`SELECT * FROM Department WHERE Department_No = ${id}`;
    
    if (result.length === 0) {
      return handleNotFound(res, 'Department');
    }
    
    handleSuccess(res, result[0], 'Department retrieved successfully');
  } catch (error) {
    handleError(res, error, 'Failed to retrieve department');
  }
}

export async function createDepartment(req, res) {
  try {
    const { Department_No, Department_Name } = req.body;
    
    const result = await sql`
      INSERT INTO Department (Department_No, Department_Name)
      VALUES (${Department_No}, ${Department_Name})
      RETURNING *
    `;
    
    handleCreated(res, result[0], 'Department created successfully');
  } catch (error) {
    handleError(res, error, 'Failed to create department');
  }
}

export async function updateDepartment(req, res) {
  try {
    const { id } = req.params;
    const { Department_Name } = req.body;
    
    const result = await sql`
      UPDATE Department
      SET Department_Name = ${Department_Name}
      WHERE Department_No = ${id}
      RETURNING *
    `;
    
    if (result.length === 0) {
      return handleNotFound(res, 'Department');
    }
    
    handleSuccess(res, result[0], 'Department updated successfully');
  } catch (error) {
    handleError(res, error, 'Failed to update department');
  }
}

export async function deleteDepartment(req, res) {
  try {
    const { id } = req.params;
    
    const result = await sql`
      DELETE FROM Department
      WHERE Department_No = ${id}
      RETURNING *
    `;
    
    if (result.length === 0) {
      return handleNotFound(res, 'Department');
    }
    
    handleSuccess(res, result[0], 'Department deleted successfully');
  } catch (error) {
    handleError(res, error, 'Failed to delete department');
  }
}
