import { exerciseHistoryIndexes, objectStoreNames } from '/Constants.js';
import { promiseIndexedDB } from '/lib/PromiseIndexedDB.js';
import '/models/Workout.js';
import '/models/Exercise.js';
import { workoutsStartStore } from '/store/WorkoutsStartStore.js';

class WorkoutsService {
    /** @param {WorkoutCreateData} workout  */
    addUserWorkout(workout) {
        return promiseIndexedDB.add(objectStoreNames.userWorkouts, workout);
    }

    /** @param {Workout} workout  */
    putUserWorkout(workout) {
        return promiseIndexedDB.put(objectStoreNames.userWorkouts, workout);
    }

    /** @return {Promise<Workout[]>} */
    getUserWorkouts() {
        return promiseIndexedDB.getAll(objectStoreNames.userWorkouts);
    }

    /** 
     * @param {number} id  
     * @return {Promise<Workout | undefined>}
     */
    getUserWorkout(id) {
        return promiseIndexedDB.get(objectStoreNames.userWorkouts, id);
    }

    /** @param {number} id  */
    deleteUserWorkout(id) {
        return promiseIndexedDB.delete(objectStoreNames.userWorkouts, id);
    }

    saveUserWorkout() {
        if (workoutsStartStore.workoutId === undefined) {
            return;
        }

        const workout = {
            WorkoutId: workoutsStartStore.workoutId,
            Exercises: workoutsStartStore.exercises,
            Date: new Date(),
        };

        promiseIndexedDB.put(objectStoreNames.workoutHistory, workout);

        return Promise.all(workoutsStartStore.exercises.map(async (exercise) => {
            /** @type {ExerciseHistory} */
            const exerciseHistory = await promiseIndexedDB.getByIndex(
                objectStoreNames.exerciseHistory,
                exerciseHistoryIndexes.exerciseId,
                exercise.id
            );

            const newHistoryEntries = exercise.sets.map((set) => ({
                Date: new Date(),
                Weight: set.weight ?? 0,
                Reps: set.reps ?? 0,
            }));

            if (exerciseHistory === undefined) {
                /** @type {ExerciseHistoryCreateData} */
                const newExerciseHistory = {
                    ExerciseId: exercise.id,
                    History: newHistoryEntries,
                };

                await promiseIndexedDB.put(objectStoreNames.exerciseHistory, newExerciseHistory);
                return;
            }

            exerciseHistory.History.push(...newHistoryEntries);
            await promiseIndexedDB.put(objectStoreNames.exerciseHistory, exerciseHistory);
            return;
        }));
    }

    /** @returns {Promise<WorkoutHistoryEntry[]>} */
    getWorkoutHistory() {
        return promiseIndexedDB.getAll(objectStoreNames.workoutHistory);
    }
}

export const workoutsService = new WorkoutsService();