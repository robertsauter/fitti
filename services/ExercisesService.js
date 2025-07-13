import { exerciseHistoryIndexes, globalObjectStoreNames, objectStoreNames } from '/Constants.js';
import { promiseIndexedDB } from '/lib/PromiseIndexedDB.js';
import '/models/ExerciseResponse.js';
import '/models/Exercise.js';

class ExercisesService {
    fetchGlobalExercises() {
        return fetch('http://localhost:8000/exercises');
    }

    /** 
     * @param {string} id
     * @return {Promise<ExerciseResponse | undefined>} 
     * */
    getGlobalExercise(id) {
        return promiseIndexedDB.get(globalObjectStoreNames.globalExercises, id);
    }

    /** @return {Promise<ExerciseResponse[]>} */
    getGlobalExercises() {
        return promiseIndexedDB.getAll(globalObjectStoreNames.globalExercises);
    }

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

    /** @param {string} exerciseId  */
    async getUserOrGlobalExercise(exerciseId) {
        const idAsNumber = Number(exerciseId);

        if (Number.isNaN(idAsNumber)) {
            return this.getGlobalExercise(exerciseId);
        }

        return this.getUserExercise(idAsNumber);
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

    async syncGlobalExercises() {
        const response = await this.fetchGlobalExercises();

        if (!response.ok) {
            return;
        }

        /** @type {ExerciseResponse[]} */
        const exercises = await response.json();

        return promiseIndexedDB.putAll(globalObjectStoreNames.globalExercises, exercises);
    }

    /** 
     * @param {string} id  
     * @returns {Promise<ExerciseHistory>}
     * */
    async getExerciseHistory(id) {
        return promiseIndexedDB.getByIndex(objectStoreNames.exerciseHistory, exerciseHistoryIndexes.exerciseId, id);
    }

    /** 
     * @param {string} id  
     * @returns {Promise<boolean>}
     * */
    async doesExerciseExist(id) {
        const idAsNumber = Number(id);

        let count = 0;

        if (Number.isNaN(idAsNumber)) {
            count = await promiseIndexedDB.count(globalObjectStoreNames.globalExercises, id)
        } else {
            count = await promiseIndexedDB.count(objectStoreNames.userExercises, idAsNumber);
        }

        return count > 0;
    }
}

export const exercisesService = new ExercisesService();