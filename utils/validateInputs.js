/**
 * Returns true when the input is missing, empty, or only whitespace.
 * Use this to guard required string fields before processing them.
 *
 * Previously the check was `input.trim() === null` which is always false
 * because String.prototype.trim() returns a string, never null.
 *
 * @param {*} input
 * @returns {boolean}
 */
export const validateInput = (input) => {
  return !input || input.trim() === "";
};
