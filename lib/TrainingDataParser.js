import '/models/Exercise.js';
import '/models/Workout.js';
import '/models/TrainingData.js';

class TrainingDataParser {
    constructor() {
        this.parseUserExercise = this.parseUserExercise.bind(this);
        this.parseExerciseHistory = this.parseExerciseHistory.bind(this);
        this.parseExerciseHistoryEntry = this.parseExerciseHistoryEntry.bind(this);
        this.parseUserWorkout = this.parseUserWorkout.bind(this);
        this.parseWorkoutExercise = this.parseWorkoutExercise.bind(this);
        this.parseWorkoutHistoryEntry = this.parseWorkoutHistoryEntry.bind(this);
        this.parseWorkoutStartExercise = this.parseWorkoutStartExercise.bind(this);
        this.parseWorkoutStartSet = this.parseWorkoutStartSet.bind(this);
    }

    /** 
     * @param {unknown} trainingData  
     * */
    getTrainingData(trainingData) {
        const parsedTrainingData = {};

        if (typeof trainingData !== 'object' || trainingData === null) {
            return null;
        }

        if ('userExercises' in trainingData) {
            const parsedUserExercises = this.#parseUserExercises(trainingData.userExercises);

            if (parsedUserExercises !== null) {
                parsedTrainingData.userExercises = parsedUserExercises;
            }
        }

        if ('exerciseHistories' in trainingData) {
            const parsedExerciseHistories = this.#parseExerciseHistories(trainingData.exerciseHistories);

            if (parsedExerciseHistories !== null) {
                parsedTrainingData.exerciseHistories = parsedExerciseHistories;
            }
        }

        if ('userWorkouts' in trainingData) {
            const parsedUserWorkouts = this.#parseUserWorkouts(trainingData.userWorkouts);

            if (parsedUserWorkouts !== null) {
                parsedTrainingData.userWorkouts = parsedUserWorkouts;
            }
            this.#parseUserWorkouts(trainingData.userWorkouts);
        }

        if ('workoutHistory' in trainingData) {
            const parsedWorkoutHistory = this.#parseWorkoutHistory(trainingData.workoutHistory);

            if (parsedWorkoutHistory !== null) {
                parsedTrainingData.workoutHistory = parsedWorkoutHistory;
            }
        }

        return parsedTrainingData;
    }

    /** 
     * @param {unknown} exercises  
     * @returns {Exercise[] | null}
     * */
    #parseUserExercises(exercises) {
        if (!Array.isArray(exercises)) {
            return null;
        }

        return exercises
            .map(this.parseUserExercise)
            .filter((exercise) => exercise !== null);
    }

    /** 
     * @param {unknown} exercise  
     * @returns {Exercise | null}
     * */
    parseUserExercise(exercise) {
        if (typeof exercise !== 'object' || exercise === null) {
            return null;
        }

        if (!('ID' in exercise) || typeof exercise.ID !== 'number') {
            return null;
        }

        if (!('Name' in exercise) || typeof exercise.Name !== 'string') {
            return null;
        }

        if (!('Description' in exercise) || typeof exercise.Description !== 'string') {
            return null;
        }

        return {
            ID: exercise.ID,
            Name: exercise.Name,
            Description: exercise.Description,
        };
    }

    /** 
     * @param {unknown} histories  
     * @returns {ExerciseHistory[] | null}
     * */
    #parseExerciseHistories(histories) {
        if (!Array.isArray(histories)) {
            return null;
        }

        return histories
            .map(this.parseExerciseHistory)
            .filter((history) => history !== null);
    }

    /** 
     * @param {unknown} history  
     * @returns {ExerciseHistory | null}
     * */
    parseExerciseHistory(history) {
        if (typeof history !== 'object' || history === null) {
            return null;
        }

        if (!('ID' in history) || typeof history.ID !== 'number') {
            return null;
        }

        if (!('ExerciseId' in history) || typeof history.ExerciseId !== 'number') {
            return null;
        }

        if (!('History' in history)) {
            return null;
        }

        const validHistoryEntries = this.#parseExerciseHistoryEntries(history.History);

        if (validHistoryEntries === null) {
            return null;
        }

        return {
            ID: history.ID,
            ExerciseId: history.ExerciseId,
            History: validHistoryEntries,
        }
    }

    /** 
     * @param {unknown} entries  
     * @returns {ExerciseHistoryEntry[] | null}
     * */
    #parseExerciseHistoryEntries(entries) {
        if (!Array.isArray(entries)) {
            return null;
        }

        return entries
            .map(this.parseExerciseHistoryEntry)
            .filter((entry) => entry !== null);
    }

    /** 
     * @param {unknown} entry  
     * @returns {ExerciseHistoryEntry | null}
     * */
    parseExerciseHistoryEntry(entry) {
        if (typeof entry !== 'object' || entry === null) {
            return null;
        }

        if (!('Date' in entry) || typeof entry.Date !== 'string') {
            return null;
        }

        if (!('Weight' in entry) || typeof entry.Weight !== 'number') {
            return null;
        }

        if (!('Reps' in entry) || typeof entry.Reps !== 'number') {
            return null;
        }

        return {
            Date: new Date(entry.Date),
            Weight: entry.Weight,
            Reps: entry.Reps,
        }
    }

    /** 
     * @param {unknown} workouts  
     * @returns {Workout[] | null}
     * */
    #parseUserWorkouts(workouts) {
        if (!Array.isArray(workouts)) {
            return null;
        }

        return workouts
            .map(this.parseUserWorkout)
            .filter((workout) => workout !== null);
    }

    /** 
     * @param {unknown} workout  
     * @returns {Workout | null}
     * */
    parseUserWorkout(workout) {
        if (typeof workout !== 'object' || workout === null) {
            return null;
        }

        if (!('ID' in workout) || typeof workout.ID !== 'number') {
            return null;
        }

        if (!('Name' in workout) || typeof workout.Name !== 'string') {
            return null;
        }

        if (!('Exercises' in workout)) {
            return null;
        }

        const validWorkoutExercises = this.#parseWorkoutExercises(workout.Exercises);

        if (validWorkoutExercises === null) {
            return null;
        }

        return {
            ID: workout.ID,
            Name: workout.Name,
            Exercises: validWorkoutExercises,
        }
    }

    /** 
     * @param {unknown} exercises  
     * @returns {WorkoutExercise[] | null}
     * */
    #parseWorkoutExercises(exercises) {
        if (!Array.isArray(exercises)) {
            return null;
        }

        return exercises
            .map(this.parseWorkoutExercise)
            .filter((exercise) => exercise !== null);
    }

    /** 
     * @param {unknown} exercise  
     * @returns {WorkoutExercise | null}
     * */
    parseWorkoutExercise(exercise) {
        if (typeof exercise !== 'object' || exercise === null) {
            return null;
        }

        if (!('ID' in exercise) || typeof exercise.ID !== 'number') {
            return null;
        }

        if (!('Sets' in exercise) || typeof exercise.Sets !== 'number') {
            return null;
        }

        return {
            ID: exercise.ID,
            Sets: exercise.Sets,
        };
    }

    /** 
     * @param {unknown} workoutHistory  
     * @returns {WorkoutHistoryEntry[] | null}
     * */
    #parseWorkoutHistory(workoutHistory) {
        if (!Array.isArray(workoutHistory)) {
            return null;
        }

        return workoutHistory
            .map(this.parseWorkoutHistoryEntry)
            .filter((entry) => entry !== null);
    }

    /** 
     * @param {unknown} entry  
     * @returns {WorkoutHistoryEntry | null}
     * */
    parseWorkoutHistoryEntry(entry) {
        if (typeof entry !== 'object' || entry === null) {
            return null;
        }

        if (!('ID' in entry) || typeof entry.ID !== 'number') {
            return null;
        }

        if (!('WorkoutId' in entry) || typeof entry.WorkoutId !== 'number') {
            return null;
        }

        if (!('Date' in entry) || typeof entry.Date !== 'string') {
            return null;
        }

        if (!('Exercises' in entry)) {
            return null;
        }

        const validExercises = this.#parseWorkoutStartExercises(entry.Exercises);

        if (validExercises === null) {
            return null;
        }

        return {
            ID: entry.ID,
            WorkoutId: entry.WorkoutId,
            Date: new Date(entry.Date),
            Exercises: validExercises,
        }
    }

    /** 
     * @param {unknown} exercises  
     * @returns {WorkoutStartExercise[] | null}
     * */
    #parseWorkoutStartExercises(exercises) {
        if (!Array.isArray(exercises)) {
            return null;
        }

        return exercises
            .map(this.parseWorkoutStartExercise)
            .filter((exercise) => exercise !== null);
    }

    /** 
     * @param {unknown} exercise  
     * @returns {WorkoutStartExercise | null}
     * */
    parseWorkoutStartExercise(exercise) {
        if (typeof exercise !== 'object' || exercise === null) {
            return null;
        }

        if (!('id' in exercise) || typeof exercise.id !== 'number') {
            return null;
        }

        if (!('sets' in exercise)) {
            return null;
        }

        const validSets = this.#parseWorkoutStartSets(exercise.sets);

        if (validSets === null) {
            return null;
        }

        return {
            id: exercise.id,
            sets: validSets,
        }
    }

    /** 
     * @param {unknown} sets  
     * @returns {WorkoutStartSet[] | null}
     * */
    #parseWorkoutStartSets(sets) {
        if (!Array.isArray(sets)) {
            return null;
        }

        return sets
            .map(this.parseWorkoutStartSet)
            .filter((set) => set !== null);
    }

    /** 
     * @param {unknown} set  
     * @returns {WorkoutStartSet | null}
     * */
    parseWorkoutStartSet(set) {
        if (typeof set !== 'object' || set === null) {
            return null;
        }

        if (!('weight' in set) || (typeof set.weight !== 'number' && set.weight !== null)) {
            return null;
        }

        if (!('reps' in set) || (typeof set.reps !== 'number' && set.reps !== null)) {
            return null;
        }

        return {
            weight: set.weight,
            reps: set.reps,
        }
    }
}

export const trainingDataParser = new TrainingDataParser();