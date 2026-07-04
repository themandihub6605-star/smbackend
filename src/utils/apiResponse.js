// Every successful API response follows the same shape:
// { success: true, message, data }
// This keeps frontend code predictable across the whole big project.
const sendResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

module.exports = sendResponse;
