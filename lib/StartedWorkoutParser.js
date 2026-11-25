import '/models/Workout.js';

class StartedWorkoutParser {
    constructor() {
        this.parseExercise = this.parseExercise.bind(this);
        this.parseSet = this.parseSet.bind(this);
    }

    /**
     * @param {unknown} startedWorkoutData 
     * @returns {StartedWorkout | null}
     */
    parseStartedWorkout(startedWorkoutData) {
        if (typeof startedWorkoutData !== 'object' || startedWorkoutData === null) {
            return null;
        }

        const startedWorkout = {};
        if ('id' in startedWorkoutData && typeof startedWorkoutData.id === 'number') {
            startedWorkout.id = startedWorkoutData.id;
        }

        if ('startDate' in startedWorkoutData && typeof startedWorkoutData.startDate === 'string') {
            startedWorkout.startDate = new Date(startedWorkoutData.startDate);
        }

        if ('exercises' in startedWorkoutData && Array.isArray(startedWorkoutData.exercises)) {
            const exercises = startedWorkoutData.exercises
                .map(this.parseExercise)
                .filter((exercise) => exercise !== null);

            startedWorkout.exercises = exercises;
        }

        return startedWorkout;
    }

    /** 
     * @param {unknown} exerciseData
     * @returns {WorkoutStartExercise | null}
     * */
    parseExercise(exerciseData) {
        if (typeof exerciseData !== 'object' || exerciseData === null) {
            return null;
        }

        const exercise = {};
        if ('id' in exerciseData && typeof exerciseData.id === 'number') {
            exercise.id = exerciseData.id;
        }

        if ('sets' in exerciseData && Array.isArray(exerciseData.sets)) {
            const sets = exerciseData.sets
                .map(this.parseSet)
                .filter((set) => set !== null);

            exercise.sets = sets;
        }

        return exercise;
    }

    /** 
     * @param {unknown} setData
     * @returns {WorkoutStartSet | null}
     * */
    parseSet(setData) {
        if (typeof setData !== 'object' || setData === null) {
            return null;
        }

        const set = {};
        if ('weight' in setData && typeof setData.weight === 'number') {
            set.weight = setData.weight;
        }

        if ('reps' in setData && typeof setData.reps === 'number') {
            set.reps = setData.reps;
        }

        return set;
    }
}

export const startedWorkoutParser = new StartedWorkoutParser();