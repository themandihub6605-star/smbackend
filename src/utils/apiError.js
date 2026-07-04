// Use this everywhere instead of throwing plain Error, so every error
// has a proper HTTP statusCode attached to it.
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ApiError;
