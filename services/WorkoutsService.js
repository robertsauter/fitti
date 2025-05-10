import { objectStoreNames } from '/Constants.js';
import { promiseIndexedDB } from '/lib/PromiseIndexedDB.js';
import '/models/Workout.js';

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
     * @return {Promise<Workout>}
     */
    getUserWorkout(id) {
        return promiseIndexedDB.get(id, objectStoreNames.userWorkouts);
    }
}

export const workoutsService = new WorkoutsService();