/**
 * Standardised success response wrapper.
 *
 * Mirrors the existing ApiError class so all API responses —
 * both success and error — follow the same shape.
 *
 * Usage:
 *   res.status(200).json(new ApiResponse(200, data, "Tours fetched successfully"));
 */
class ApiResponse {
  /**
   * @param {number} statusCode  - HTTP status code (2xx)
   * @param {*}      data        - The payload to return to the client
   * @param {string} [message]   - Human-readable success message
   */
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
