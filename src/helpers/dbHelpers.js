import sql from '../services/neonClient.js';

export async function executeQuery(queryText, errorMessage = 'Database query failed') {
  try {
    const result = await sql.query(queryText);
    return result;
  } catch (error) {
    console.error(errorMessage, error);
    throw error;
  }
}

export function handleError(res, error, message = 'Server error') {
  console.error(message, error);
  res.status(500).json({ error: message, details: error.message });
}

export function handleNotFound(res, resource = 'Resource') {
  res.status(404).json({ error: `${resource} not found` });
}

export function handleSuccess(res, data, message = 'Success') {
  res.status(200).json({ message, data });
}

export function handleCreated(res, data, message = 'Created successfully') {
  res.status(201).json({ message, data });
}
