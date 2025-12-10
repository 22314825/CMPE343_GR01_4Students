import sql from '../../services/neonClient.js';
import { handleError, handleNotFound, handleSuccess, handleCreated } from '../../helpers/dbHelpers.js';

export async function getAllPayments(req, res) {
  try {
    const result = await sql`SELECT * FROM Payments ORDER BY Payment_ID`;
    handleSuccess(res, result, 'Payments retrieved successfully');
  } catch (error) {
    handleError(res, error, 'Failed to retrieve payments');
  }
}

export async function getPaymentById(req, res) {
  try {
    const { id } = req.params;
    const result = await sql`SELECT * FROM Payments WHERE Payment_ID = ${id}`;
    
    if (result.length === 0) {
      return handleNotFound(res, 'Payment');
    }
    
    handleSuccess(res, result[0], 'Payment retrieved successfully');
  } catch (error) {
    handleError(res, error, 'Failed to retrieve payment');
  }
}

export async function createPayment(req, res) {
  try {
    const { Student_ID, Payment_Status, Payment_Method, Payment_Date, Payment_Amount } = req.body;
    
    const result = await sql`
      INSERT INTO Payments (Student_ID, Payment_Status, Payment_Method, Payment_Date, Payment_Amount)
      VALUES (${Student_ID}, ${Payment_Status}, ${Payment_Method}, ${Payment_Date}, ${Payment_Amount})
      RETURNING *
    `;
    
    handleCreated(res, result[0], 'Payment created successfully');
  } catch (error) {
    handleError(res, error, 'Failed to create payment');
  }
}

export async function updatePayment(req, res) {
  try {
    const { id } = req.params;
    const { Student_ID, Payment_Status, Payment_Method, Payment_Date, Payment_Amount } = req.body;
    
    const result = await sql`
      UPDATE Payments
      SET Student_ID = ${Student_ID}, Payment_Status = ${Payment_Status}, 
          Payment_Method = ${Payment_Method}, Payment_Date = ${Payment_Date}, 
          Payment_Amount = ${Payment_Amount}
      WHERE Payment_ID = ${id}
      RETURNING *
    `;
    
    if (result.length === 0) {
      return handleNotFound(res, 'Payment');
    }
    
    handleSuccess(res, result[0], 'Payment updated successfully');
  } catch (error) {
    handleError(res, error, 'Failed to update payment');
  }
}

export async function deletePayment(req, res) {
  try {
    const { id } = req.params;
    
    const result = await sql`
      DELETE FROM Payments
      WHERE Payment_ID = ${id}
      RETURNING *
    `;
    
    if (result.length === 0) {
      return handleNotFound(res, 'Payment');
    }
    
    handleSuccess(res, result[0], 'Payment deleted successfully');
  } catch (error) {
    handleError(res, error, 'Failed to delete payment');
  }
}
