/** 
 * @typedef {Object} WorkoutExercise
 * @property {string} ID
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