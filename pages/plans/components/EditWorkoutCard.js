import '/models/Workout.js';
import '/models/Exercise.js';
import '/models/ExerciseResponse.js';
import { workoutsService } from '/services/WorkoutsService.js';

export class EditWorkoutCard extends HTMLElement {
    #ids = {
        workoutWrapper: 'workoutWrapper',
        upButton: 'upButton',
        downButton: 'downButton',
        deleteButton: 'deleteButton',
    };

    #inputNames = {
        workout: 'workout',
    };

    #workoutId = 0;

    /** @type {Workout[]} */
    #userWorkouts = [];

    /** @type {string | null} */
    #selectedWorkoutId = null;

    get selectedWorkoutId() {
        return this.#selectedWorkoutId;
    }

    set selectedWorkoutId(id) {
        this.#selectedWorkoutId = id;
    }

    constructor() {
        super();

        this.updateSelectedWorkout = this.updateSelectedWorkout.bind(this);
        this.moveUp = this.moveUp.bind(this);
        this.moveDown = this.moveDown.bind(this);
        this.deleteWorkout = this.deleteWorkout.bind(this);

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <li></li>
        `;
    }

    async connectedCallback() {
        this.#workoutId = Number(this.getAttribute('workoutId'));

        const wrapperId = `${this.#ids.workoutWrapper}${this.#workoutId}`;
        const upButtonId = `${this.#ids.upButton}${this.#workoutId}`;
        const downButtonId = `${this.#ids.downButton}${this.#workoutId}`;
        const deleteButtonId = `${this.#ids.deleteButton}${this.#workoutId}`;
        const workoutSelectName = `${this.#inputNames.workout}${this.#workoutId}`;

        this.#userWorkouts = await workoutsService.getUserWorkouts();

        const wrapper = this.shadowRoot.querySelector('li');
        wrapper.id = wrapperId;

        wrapper.innerHTML = `
            <button id="${upButtonId}" type="button">oben</button>
            <button id="${downButtonId}" type="button">unten</button>
            <button id="${deleteButtonId}" type="button">entfernen</button>
            <label for="${workoutSelectName}">Übung</label>
            <select id="${workoutSelectName}" name="${workoutSelectName}">
                ${this.#userWorkouts.map((workout) => `
                    <option value="${workout.ID}">${workout.Name}</option>
                `)}
            </select>
        `;

        const workoutSelect = this.shadowRoot.getElementById(workoutSelectName);

        if (workoutSelect instanceof HTMLSelectElement) {
            if (this.#selectedWorkoutId === null) {
                this.#selectedWorkoutId = String(this.#userWorkouts[0].ID);
            }
            workoutSelect.value = this.#selectedWorkoutId;
            workoutSelect.addEventListener('change', this.updateSelectedWorkout);
        }

        this.shadowRoot
            .getElementById(upButtonId)
            .addEventListener('click', this.moveUp);

        this.shadowRoot
            .getElementById(downButtonId)
            .addEventListener('click', this.moveDown);

        this.shadowRoot
            .getElementById(deleteButtonId)
            .addEventListener('click', this.deleteWorkout);
    }

    /** @param {Event} event */
    updateSelectedWorkout(event) {
        if (event.currentTarget instanceof HTMLSelectElement) {
            this.#selectedWorkoutId = event.currentTarget.value;
        }
    }

    moveUp() {
        const previousWorkout = this.previousElementSibling;

        if (previousWorkout === null) {
            return;
        }

        previousWorkout.before(this);
    }

    moveDown() {
        const nextWorkout = this.nextElementSibling;

        if (nextWorkout === null) {
            return;
        }

        nextWorkout.after(this);
    }

    deleteWorkout() {
        this.remove();
    }
}

customElements.define('fit-edit-workout-card', EditWorkoutCard);