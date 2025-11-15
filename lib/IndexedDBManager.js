import { migrationIds, objectStoreNames } from '/Constants.js';
import { promiseIndexedDB } from '/lib/PromiseIndexedDB.js';
import '/models/Updater.js';
import '/models/Exercise.js';
import '/models/Workout.js';

/**
 * @typedef {Object} ExerciseHistoryWithStringExerciseId
 * @property {number} ID
 * @property {string} ExerciseId
 * @property {ExerciseHistoryEntry[]} History
 */

/** 
 * @typedef {Object} WorkoutExerciseWithStringId
 * @property {string} ID
 * @property {number} Sets
 */

/** 
 * @typedef {Object} WorkoutWithStringExerciseId
 * @property {number} ID
 * @property {string} Name
 * @property {WorkoutExerciseWithStringId[]} Exercises
 */

/** 
 * @typedef {Object} WorkoutStartExerciseWithStringId
 * @property {string} id
 * @property {WorkoutStartSet[]} sets
 */

/**
 * @typedef {Object} WorkoutHistoryEntryWithStringExerciseId
 * @property {number} ID
 * @property {number} WorkoutId
 * @property {WorkoutStartExerciseWithStringId[]} Exercises
 * @property {Date} Date
 */

class IndexedDBManager {
    version = 18;

    runMigrations() {
        this.#migrateExerciseIdAsNumber();
    }

    #migrateExerciseIdAsNumber() {
        const isMigrated = !!localStorage.getItem(migrationIds.migrateExerciseIdAsNumber);

        if (isMigrated) {
            return;
        }

        /** @type {Updater<ExerciseHistoryWithStringExerciseId, ExerciseHistory>} */
        const migrateExerciseHistory = (history) => ({
            ...history,
            ExerciseId: Number(history.ExerciseId),
        });

        /** @type {Updater<WorkoutWithStringExerciseId, Workout>} */
        const migrateWorkout = (workout) => ({
            ...workout,
            Exercises: workout.Exercises.map((exercise) => ({
                ...exercise,
                ID: Number(exercise.ID),
            })),
        });

        /** @type {Updater<WorkoutHistoryEntryWithStringExerciseId, WorkoutHistoryEntry} */
        const migrateWorkoutHistory = (history) => ({
            ...history,
            Exercises: history.Exercises.map((exercise) => ({
                ...exercise,
                id: Number(exercise.id),
            })),
        })

        promiseIndexedDB.updateAll(objectStoreNames.exerciseHistory, migrateExerciseHistory);
        promiseIndexedDB.updateAll(objectStoreNames.userWorkouts, migrateWorkout);
        promiseIndexedDB.updateAll(objectStoreNames.workoutHistory, migrateWorkoutHistory);

        localStorage.setItem(migrationIds.migrateExerciseIdAsNumber, 'true');
    }
}

export const indexedDBManager = new IndexedDBManager();