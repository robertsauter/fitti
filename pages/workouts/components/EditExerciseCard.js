import '/models/Workout.js';
import '/models/Exercise.js';
import '/models/ExerciseResponse.js';
import { exercisesService } from '/services/ExercisesService.js';
import { ExerciseSelect } from '/components/ExerciseSelect.js';

export class EditExerciseCard extends HTMLElement {
    #ids = {
        exerciseWrapper: 'exerciseWrapper',
        upButton: 'upButton',
        downButton: 'downButton',
        deleteButton: 'deleteButton',
    };

    #inputNames = {
        sets: 'sets',
    };

    #exerciseId = 0;

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
        const setsInputName = `${this.#inputNames.sets}${this.#exerciseId}`;

        const wrapper = this.shadowRoot.querySelector('li');
        wrapper.id = wrapperId;

        wrapper.innerHTML = `
            <button id="${upButtonId}" type="button">Oben</button>
            <button id="${downButtonId}" type="button">Unten</button>
            <button id="${deleteButtonId}" type="button">Entfernen</button>
        `;

        const exerciseSelect = new ExerciseSelect(this.#exerciseId);

        if (this.#selectedExerciseId !== null) {
            exerciseSelect.selectedExerciseId = this.#selectedExerciseId;
        }

        exerciseSelect.addEventListener('change', this.updateSelectedExercise);
        wrapper.appendChild(exerciseSelect);

        const setsLabel = document.createElement('label');
        setsLabel.setAttribute('for', setsInputName);
        wrapper.appendChild(setsLabel);

        const setsInput = document.createElement('input');
        setsInput.name = setsInputName;
        setsInput.id = setsInputName;
        setsInput.type = 'number';
        setsInput.min = '1';
        setsInput.value = String(this.#setsAmount);
        setsInput.addEventListener('change', this.updateSetsAmount);
        wrapper.appendChild(setsInput);

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
        if (event.currentTarget instanceof ExerciseSelect) {
            this.#selectedExerciseId = event.currentTarget.selectedExerciseId;
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