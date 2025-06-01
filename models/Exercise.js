/**
 * @typedef {Object} Exercise
 * @property {number} ID
 * @property {string} Name
 * @property {string} Description
 */

/**
 * @typedef {Object} ExerciseCreateData
 * @property {string} Name
 * @property {string} Description
 */

/**
 * @typedef {Object} ExerciseHistory
 * @property {number} ID
 * @property {string} ExerciseId
 * @property {ExerciseHistoryEntry[]} History
 */

/**
 * @typedef {Object} ExerciseHistoryCreateData
 * @property {string} ExerciseId
 * @property {ExerciseHistoryEntry[]} History
 */

/**
 * @typedef {Object} ExerciseHistoryEntry
 * @property {Date} Date
 * @property {number} Weight
 * @property {number} Reps
 */