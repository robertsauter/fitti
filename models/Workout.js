/** 
 * @typedef {Object} WorkoutExercise
 * @property {number} ID
 * @property {number} Sets
 */

/** 
 * @typedef {Object} Workout
 * @property {number} ID
 * @property {string} Name
 * @property {WorkoutExercise[]} Exercises
 */

/** 
 * @typedef {Object} WorkoutCreateData
 * @property {string} Name
 * @property {WorkoutExercise[]} Exercises
 */

/** 
 * @typedef {Object} WorkoutStartExerxise
 * @property {number} id
 * @property {WorkoutStartSet[]} sets
 */

/** 
 * @typedef {Object} WorkoutStartSet
 * @property {number | null} weight
 * @property {number | null} reps
 */

/**
 * @typedef {Object} WorkoutHistoryEntry
 * @property {number} ID
 * @property {number} WorkoutId
 * @property {WorkoutStartExerxise[]} Exercises
 * @property {Date} Date
 */