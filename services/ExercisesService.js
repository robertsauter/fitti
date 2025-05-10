import { globalObjectStoreNames, objectStoreNames } from '/Constants.js';
import { promiseIndexedDB } from '/lib/PromiseIndexedDB.js';
import '/models/ExerciseResponse.js';
import '/models/Exercise.js';

class ExercisesService {
    fetchGlobalExercises() {
        return fetch('http://localhost:8000/exercises');
    }

    /** @return {Promise<ExerciseResponse[]>} */
    getGlobalExercises() {
        return promiseIndexedDB.getAll(globalObjectStoreNames.globalExercises);
    }

    /** 
     * @param {number} id
     * @return {Promise<Exercise>} 
     * */
    getUserExercise(id) {
        return promiseIndexedDB.get(objectStoreNames.userExercises, id);
    }

    /** @return {Promise<Exercise[]>} */
    getUserExercises() {
        return promiseIndexedDB.getAll(objectStoreNames.userExercises);
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
}

export const exercisesService = new ExercisesService();