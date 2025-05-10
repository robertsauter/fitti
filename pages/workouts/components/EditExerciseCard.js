import '/models/Workout.js';
import '/models/Exercise.js';
import '/models/ExerciseResponse.js';
import { exercisesService } from '/services/ExercisesService.js';

export class EditExerciseCard extends HTMLElement {
    #ids = {
        exerciseWrapper: 'exerciseWrapper',
        upButton: 'upButton',
        downButton: 'downButton',
        deleteButton: 'deleteButton',
    };

    #inputNames = {
        exercise: 'exercise',
        sets: 'sets',
    };

    #exerciseId = 0;

    /** @type {ExerciseResponse[]} */
    #globalExercises = [];
    /** @type {Exercise[]} */
    #userExercises = [];

    /** @type {string | null} */
    #selectedExerciseId = null;

    get selectedExerciseId() {
        return this.#selectedExerciseId;
    }

    set selectedExerciseId(id) {
        this.#selectedExerciseId = id;
    }

    #setsAmount = '1';

    get setsAmount() {
        return this.#setsAmount;
    }

    set setsAmount(amount) {
        this.#setsAmount = amount;
    }

    constructor() {
        super();

        this.updateSelectedExercise = this.updateSelectedExercise.bind(this);
        this.updateSetsAmount = this.updateSetsAmount.bind(this);
        this.moveUp = this.moveUp.bind(this);
        this.moveDown = this.moveDown.bind(this);
        this.deleteExercise = this.deleteExercise.bind(this);

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <li></li>
        `;
    }

    async connectedCallback() {
        this.#exerciseId = Number(this.getAttribute('exerciseId'));

        const wrapperId = `${this.#ids.exerciseWrapper}${this.#exerciseId}`;
        const upButtonId = `${this.#ids.upButton}${this.#exerciseId}`;
        const downButtonId = `${this.#ids.downButton}${this.#exerciseId}`;
        const deleteButtonId = `${this.#ids.deleteButton}${this.#exerciseId}`;
        const exerciseSelectName = `${this.#inputNames.exercise}${this.#exerciseId}`;
        const setsInputName = `${this.#inputNames.sets}${this.#exerciseId}`;

        this.#globalExercises = await exercisesService.getGlobalExercises();
        this.#userExercises = await exercisesService.getUserExercises();

        const wrapper = this.shadowRoot.querySelector('li');
        wrapper.id = wrapperId;

        wrapper.innerHTML = `
            <button id="${upButtonId}" type="button">oben</button>
            <button id="${downButtonId}" type="button">unten</button>
            <button id="${deleteButtonId}" type="button">entfernen</button>
            <label for="${exerciseSelectName}">Übung</label>
            <select id="${exerciseSelectName}" name="${exerciseSelectName}">
                ${this.#globalExercises.length > 0 && `
                    <optgroup label="Ausgewählte Übungen">
                        ${this.#globalExercises.map((exercise) => `
                            <option value="${exercise.ID}">${exercise.Name}</option>
                        `)}
                    </optgroup>
                `}
                ${this.#userExercises.length > 0 && `
                    <optgroup label="Deine Übungen">
                        ${this.#userExercises.map((exercise) => `
                            <option value="${exercise.ID}">${exercise.Name}</option>
                        `)}
                    </optgroup>
                `}
            </select>
            <label for="${setsInputName}">Sets</label>
            <input id="${setsInputName}" name="${setsInputName}" type="number" min="1" />
        `;

        const exerciseSelect = this.shadowRoot.getElementById(exerciseSelectName);

        if (exerciseSelect instanceof HTMLSelectElement) {
            if (this.#selectedExerciseId === null) {
                this.#selectedExerciseId = this.#globalExercises[0].ID;
            }
            exerciseSelect.value = this.#selectedExerciseId;
            exerciseSelect.addEventListener('change', this.updateSelectedExercise);
        }

        const setsInput = this.shadowRoot.getElementById(setsInputName);

        if (setsInput instanceof HTMLInputElement) {
            setsInput.value = String(this.#setsAmount);
            setsInput.addEventListener('change', this.updateSetsAmount);
        }

        this.shadowRoot
            .getElementById(upButtonId)
            .addEventListener('click', this.moveUp);

        this.shadowRoot
            .getElementById(downButtonId)
            .addEventListener('click', this.moveDown);

        this.shadowRoot
            .getElementById(deleteButtonId)
            .addEventListener('click', this.deleteExercise);
    }

    /** @param {Event} event */
    updateSelectedExercise(event) {
        if (event.currentTarget instanceof HTMLSelectElement) {
            this.#selectedExerciseId = event.currentTarget.value;
        }
    }

    /** @param {Event} event */
    updateSetsAmount(event) {
        if (event.currentTarget instanceof HTMLInputElement) {
            this.#setsAmount = event.currentTarget.value;
        }
    }

    moveUp() {
        const previousExercise = this.previousElementSibling;

        if (previousExercise === null) {
            return;
        }

        previousExercise.before(this);
    }

    moveDown() {
        const nextExercise = this.nextElementSibling;

        if (nextExercise === null) {
            return;
        }

        nextExercise.after(this);
    }

    deleteExercise() {
        this.remove();
    }
}

customElements.define('fit-edit-exercise-card', EditExerciseCard);