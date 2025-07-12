import { workoutsService } from '/services/WorkoutsService.js';
import '/models/Workout.js';

class WorkoutsStartStore {
    /** @type {number} */
    #workoutId;
    /** @type {WorkoutStartExerxise[]} */
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

        this.#exercises = workout.Exercises.map((workoutExercise) => {
            const sets = Array.from(Array(workoutExercise.Sets)).map(() => ({
                weight: null,
                reps: null,
            }));

            return {
                id: workoutExercise.ID,
                sets,
            };
        });

        return;
    }

    /** @param {string} exerciseId  */
    removeExercise(exerciseId) {
        const exerciseIndex = this.#exercises.findIndex((exercise) => exercise.id === exerciseId);
        this.#exercises.splice(exerciseIndex, 1);
    }

    /**
     *  @param {string} exerciseId
     *  @returns {WorkoutStartExerxise}
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
     * @param {string} exerciseId 
     * @returns {number | undefined}
     *  */
    getSetsAmount(exerciseId) {
        return this.#exercises.find((exercise) => exercise.id === exerciseId)?.sets.length;
    }

    /** @param {string} exerciseId  */
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
     * @param {string} exerciseId 
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
     * @param {string} exerciseId 
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
     * @param {string} exerciseId 
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

    /** @param {string} exerciseId  */
    moveExerciseUp(exerciseId) {
        const foundExerciseIndex = this.#exercises.findIndex((exercise) => exercise.id === exerciseId);

        if (foundExerciseIndex === -1) {
            return;
        }

        const deletedEntries = this.#exercises.splice(foundExerciseIndex, 1);
        this.#exercises.splice(foundExerciseIndex - 1, 0, ...deletedEntries);
    }

    /** @param {string} exerciseId  */
    moveExerciseDown(exerciseId) {
        const foundExerciseIndex = this.#exercises.findIndex((exercise) => exercise.id === exerciseId);

        if (foundExerciseIndex === -1) {
            return;
        }

        const deletedEntries = this.#exercises.splice(foundExerciseIndex, 1);
        this.#exercises.splice(foundExerciseIndex + 1, 0, ...deletedEntries);
    }
}

export const workoutsStartStore = new WorkoutsStartStore();