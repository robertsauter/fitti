import { objectStoreNames } from '/Constants.js';
import { promiseIndexedDB } from '/lib/PromiseIndexedDB.js';
import '/models/Plan.js';

class PlansService {
    /** @param {PlanCreateData} plan  */
    addUserPlan(plan) {
        return promiseIndexedDB.add(objectStoreNames.userPlans, plan);
    }

    /** 
     * @param {number} id
     * @returns {Promise<Plan>} 
     * */
    getUserPlan(id) {
        return promiseIndexedDB.get(objectStoreNames.userPlans, id);
    }

    /** @returns {Promise<Plan[]>} */
    getUserPlans() {
        return promiseIndexedDB.getAll(objectStoreNames.userPlans);
    }

    /** @param {number} id  */
    deleteUserPlan(id) {
        return promiseIndexedDB.delete(objectStoreNames.userPlans, id);
    }
}

export const plansService = new PlansService();