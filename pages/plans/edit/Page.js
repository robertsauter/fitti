import { EditWorkoutCard } from '/pages/plans/components/EditWorkoutCard.js';
import { appRouter, appRouterIds } from '/Routes.js';
import { plansService } from '/services/PlansService.js';

export class PlansEditPage extends HTMLElement {
    #ids = {
        workoutsList: 'workoutsList',
        addWorkoutButton: 'addWorkoutButton',
        planForm: 'planForm',
    };

    #inputNames = {
        name: 'name',
    };

    #workoutsAmount = 0;

    /** @type {number | null} */
    #planId = null;

    constructor() {
        super();

        this.savePlan = this.savePlan.bind(this);

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
				@import url('/globals.css');
			</style>
			<div class="page-container">
                <h2>Trainingsplan bearbeiten</h2>
                <form id="${this.#ids.planForm}">
                    <label for="${this.#inputNames.name}">Trainingsplan Name</label>
                    <input id="${this.#inputNames.name}" name="${this.#inputNames.name}" required />
                    <ul id="${this.#ids.workoutsList}"></ul>
                    <button id="${this.#ids.addWorkoutButton}" type="button">Workout hinzufügen</button>
                    <button type="submit">Speichern</button>
                </form>
            </div>
        `;
    }

    connectedCallback() {
        this.shadowRoot
            .getElementById(this.#ids.addWorkoutButton)
            .addEventListener('click', () => this.addWorkout());

        this.shadowRoot
            .getElementById(this.#ids.planForm)
            .addEventListener('submit', this.savePlan);

        const id = appRouter.getParamValue('id');

        if (id !== null) {
            this.#planId = Number(id);
            this.#initializePlan();
        }
    }

    async #initializePlan() {
        const plan = await plansService.getUserPlan(this.#planId);

        const nameInput = this.shadowRoot.getElementById(this.#inputNames.name);

        if (nameInput instanceof HTMLInputElement) {
            nameInput.value = plan.Name;
        }

        plan.WorkoutIds.forEach((workoutId) => {
            this.addWorkout(workoutId);
        });
    }

    /** @param {number} [workoutId]  */
    addWorkout(workoutId) {
        const workoutElement = document.createElement('fit-edit-workout-card');

        if (!(workoutElement instanceof EditWorkoutCard)) {
            return;
        }

        workoutElement.setAttribute('workoutId', String(this.#workoutsAmount));

        if (workoutId !== undefined) {
            workoutElement.selectedWorkoutId = String(workoutId);
        }

        this.shadowRoot
            .getElementById(this.#ids.workoutsList)
            .appendChild(workoutElement);

        this.#workoutsAmount += 1;
    }

    /** @param {SubmitEvent} event  */
    async savePlan(event) {
        event.preventDefault();

        if (!(event.currentTarget instanceof HTMLFormElement)) {
            return;
        }

        const formData = new FormData(event.currentTarget);
        const planName = formData.get(this.#inputNames.name);

        if (typeof planName !== 'string') {
            return;
        }

        /** @type {number[]} */
        const workouts = [];
        this.shadowRoot
            .querySelectorAll('fit-edit-workout-card')
            .forEach((card) => {
                if (!(card instanceof EditWorkoutCard)) {
                    return;
                }

                workouts.push(Number(card.selectedWorkoutId));
            });

        if (workouts.length < 1) {
            return;
        }

        await plansService.addUserPlan({
            Name: planName,
            WorkoutIds: workouts,
        });

        appRouter.navigate(appRouterIds.plans);
    }
}

customElements.define('fit-plans-edit-page', PlansEditPage);