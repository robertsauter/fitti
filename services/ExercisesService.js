import { objectStoreNames } from '../Constants.js';
import { promiseIndexedDB } from '../lib/PromiseIndexedDB.js';
import '../models/ExerciseResponse.js'

class ExercisesService {
    fetchGlobalExercises() {
        return fetch('http://localhost:8000/exercises');
    }

    /** @return {Promise<ExerciseResponse[]>} */
    getGlobalExercises() {
        return promiseIndexedDB.getAll(objectStoreNames.globalExercises);
    }

    async syncGlobalExercises() {
        const response = await this.fetchGlobalExercises();

        if (!response.ok) {
            return;
        }

        /** @type {ExerciseResponse[]} */
        const exercises = await response.json();

        return promiseIndexedDB.putAll(objectStoreNames.globalExercises, exercises);
    }
}

export const exercisesService = new ExercisesService();