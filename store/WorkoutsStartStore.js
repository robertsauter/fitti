import { workoutsService } from '/services/WorkoutsService.js';
import '/models/Workout.js';
import { exercisesService } from '/services/ExercisesService.js';

class WorkoutsStartStore {
    /** @type {number | undefined} */
    #workoutId;
    /** @type {WorkoutStartExercise[]} */
    #exercises = [];

    get workoutId() {
        return this.#workoutId;
    }

    get exercises() {
        return this.#exercises;
    }

    /** @param {number} workoutId  */
    async initializeExercises(workoutId) {
        this.#workoutId = workoutId;

        const workout = await workoutsService.getUserWorkout(Number(workoutId));

        if (workout === undefined) {
            return;
        }

        this.#exercises = await Promise.all(
            workout.Exercises.map(async (workoutExercise) => {
                /** @type {WorkoutStartSet[]} */
                const sets = Array.from(Array(workoutExercise.Sets)).map(() => ({
                    weight: null,
                    reps: null,
                }));

                const exerciseHistory = await exercisesService.getExerciseHistory(workoutExercise.ID);

                if (exerciseHistory) {
                    const exerciseHistoryByDate = exercisesService.sortHistory(exerciseHistory);

                    sets[0] = {
                        weight: exerciseHistoryByDate[0][0].Weight,
                        reps: exerciseHistoryByDate[0][0].Reps,
                    }
                }

                return {
                    id: workoutExercise.ID,
                    sets,
                };
            })
        );

        return;
    }

    /** @param {number} exerciseId  */
    removeExercise(exerciseId) {
        const exerciseIndex = this.#exercises.findIndex((exercise) => exercise.id === exerciseId);
        this.#exercises.splice(exerciseIndex, 1);
    }

    /**
     *  @param {number} exerciseId
     *  @returns {WorkoutStartExercise}
     *   */
    addExercise(exerciseId) {
        const newExercise = {
            id: exerciseId,
            sets: [{
                reps: null,
                weight: null
            }],
        };

        this.#exercises.push(newExercise);

        return newExercise;
    }

    /** 
     * @param {number} exerciseId 
     * @returns {number | undefined}
     *  */
    getSetsAmount(exerciseId) {
        return this.#exercises.find((exercise) => exercise.id === exerciseId)?.sets.length;
    }

    /** @param {number} exerciseId  */
    addSet(exerciseId) {
        const foundExercise = this.#exercises.find((exercise) => exercise.id === exerciseId);

        if (foundExercise === undefined) {
            return;
        }

        foundExercise.sets.push({
            weight: null,
            reps: null,
        });
    }

    /**
     * @param {number} exerciseId 
     * @param {number} setIndex 
     */
    removeSet(exerciseId, setIndex) {
        const foundExercise = this.#exercises.find((exercise) => exercise.id === exerciseId);

        if (foundExercise === undefined) {
            return;
        }

        foundExercise.sets.splice(setIndex, 1);
    }

    /**
     * @param {number} exerciseId 
     * @param {number} setIndex
     * @param {number} weight 
     */
    updateWeight(exerciseId, setIndex, weight) {
        const foundExercise = this.#exercises.find((exercise) => exercise.id === exerciseId);

        if (foundExercise === undefined || foundExercise.sets.length < setIndex) {
            return;
        }

        foundExercise.sets[setIndex].weight = weight;
    }

    /**
     * @param {number} exerciseId 
     * @param {number} setIndex
     * @param {number} reps 
     */
    updateReps(exerciseId, setIndex, reps) {
        const foundExercise = this.#exercises.find((exercise) => exercise.id === exerciseId);

        if (foundExercise === undefined || foundExercise.sets.length < setIndex) {
            return;
        }

        foundExercise.sets[setIndex].reps = reps;
    }

    /** @param {number} exerciseId  */
    moveExerciseUp(exerciseId) {
        const foundExerciseIndex = this.#exercises.findIndex((exercise) => exercise.id === exerciseId);

        if (foundExerciseIndex === -1) {
            return;
        }

        const deletedEntries = this.#exercises.splice(foundExerciseIndex, 1);
        this.#exercises.splice(foundExerciseIndex - 1, 0, ...deletedEntries);
    }

    /** @param {number} exerciseId  */
    moveExerciseDown(exerciseId) {
        const foundExerciseIndex = this.#exercises.findIndex((exercise) => exercise.id === exerciseId);

        if (foundExerciseIndex === -1) {
            return;
        }

        const deletedEntries = this.#exercises.splice(foundExerciseIndex, 1);
        this.#exercises.splice(foundExerciseIndex + 1, 0, ...deletedEntries);
    }

    reset() {
        this.#workoutId = undefined;
        this.#exercises = [];
    }
}

export const workoutsStartStore = new WorkoutsStartStore();