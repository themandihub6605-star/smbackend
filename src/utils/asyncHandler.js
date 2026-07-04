// Wraps an async controller function so we don't repeat try/catch
// everywhere. Any thrown error goes to our error-handling middleware.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
