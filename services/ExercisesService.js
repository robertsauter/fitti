import { objectStoreNames } from '../Constants.js';
import { promiseIndexedDB } from '../lib/PromiseIndexedDB.js';

class ExercisesService {
    getExercises() {
        return fetch('http://localhost:8000/exercises');
    }

    async syncGlobalExercises() {
        const response = await this.getExercises();

        if (!response.ok) {
            return;
        }

        /** @type {ExerciseResponse[]} */
        const exercises = await response.json();

        await promiseIndexedDB.putAll(objectStoreNames.exercises, exercises);
    }
}

export const exercisesService = new ExercisesService();