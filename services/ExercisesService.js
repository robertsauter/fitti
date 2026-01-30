import { exerciseHistoryIndexes, objectStoreNames } from '/Constants.js';
import { promiseIndexedDB } from '/lib/PromiseIndexedDB.js';
import '/models/Exercise.js';
import { compareDate, isSameDay } from '/lib/DateHelpers.js';

class ExercisesService {
    /** 
     * @param {number} id
     * @return {Promise<Exercise | undefined>}
     * */
    getUserExercise(id) {
        return promiseIndexedDB.get(objectStoreNames.userExercises, id);
    }

    /** @return {Promise<Exercise[]>} */
    getUserExercises() {
        return promiseIndexedDB.getAll(objectStoreNames.userExercises);
    }

    async getUserExercisesSorted() {
        /** @type {Exercise[]} */
        const exercises = await promiseIndexedDB.getAll(objectStoreNames.userExercises);
        exercises.sort((a, b) => a.Name.localeCompare(b.Name));
        return exercises;
    }

    /**
     * @param {ExerciseCreateData} exercise 
     */
    addUserExercise(exercise) {
        return promiseIndexedDB.add(objectStoreNames.userExercises, exercise);
    }

    /**
     * @param {Exercise} exercise
     */
    putUserExercise(exercise) {
        return promiseIndexedDB.put(objectStoreNames.userExercises, exercise);
    }

    /** @param {number} id  */
    deleteUserExercise(id) {
        return promiseIndexedDB.delete(objectStoreNames.userExercises, id);
    }

    /** 
     * @param {number} id  
     * @returns {Promise<ExerciseHistory>}
     * */
    async getExerciseHistory(id) {
        return promiseIndexedDB.getByIndex(objectStoreNames.exerciseHistory, exerciseHistoryIndexes.exerciseId, id);
    }

    /** 
     * @param {number} id  
     * @returns {Promise<boolean>}
     * */
    async doesExerciseExist(id) {
        const count = await promiseIndexedDB.count(objectStoreNames.userExercises, id);

        return count > 0;
    }

    /** 
     * @param {ExerciseHistoryEntry[][]} groupedEntries 
     * @param {ExerciseHistoryEntry} entry 
     * */
    groupHistoryEntriesByDate(groupedEntries, entry) {
        if (groupedEntries.length === 0) {
            return [[entry]];
        }

        const lastEntryGroup = groupedEntries[groupedEntries.length - 1];
        if (isSameDay(lastEntryGroup[0].Date, entry.Date)) {
            const newLastEntryGroup = [...lastEntryGroup, entry];
            const groupedEntriesWithoutLast = groupedEntries.slice(0, -1);
            return [...groupedEntriesWithoutLast, newLastEntryGroup];
        }

        return [...groupedEntries, [entry]];
    }

    /** @param {ExerciseHistory} exerciseHistory */
    sortHistory(exerciseHistory) {
        return exerciseHistory.History
            .reduce(this.groupHistoryEntriesByDate, [])
            .toSorted((firstGroup, secondGroup) => (compareDate(secondGroup[0].Date, firstGroup[0].Date)));
    }
}

export const exercisesService = new ExercisesService();