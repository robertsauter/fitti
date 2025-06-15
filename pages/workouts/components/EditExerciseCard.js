import '/models/Workout.js';
import '/models/Exercise.js';
import '/models/ExerciseResponse.js';
import { exercisesService } from '/services/ExercisesService.js';
import { ExerciseSelect } from '/components/ExerciseSelect.js';
import { globalClassNames } from '/Constants.js';

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
                .card {
                   display: flex;
                   flex-direction: column;
                   gap: 0.5rem; 
                }
                .buttonsWrapper {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.5rem;
                }
            </style>
            <li class="card secondary">
                <h2>Unbekannte Übung</h2>
                <div class="card white exerciseWrapper"></div>
            </li>
        `;
    }

    async connectedCallback() {
        this.#exerciseId = Number(this.getAttribute('exerciseId'));

        const wrapperId = `${this.#ids.exerciseWrapper}${this.#exerciseId}`;
        const upButtonId = `${this.#ids.upButton}${this.#exerciseId}`;
        const downButtonId = `${this.#ids.downButton}${this.#exerciseId}`;
        const deleteButtonId = `${this.#ids.deleteButton}${this.#exerciseId}`;
        const setsInputName = `${this.#inputNames.sets}${this.#exerciseId}`;

        const wrapper = this.shadowRoot.querySelector('.exerciseWrapper');
        wrapper.id = wrapperId;

        wrapper.innerHTML = `
            <div class="buttonsWrapper">
                <button
                    id="${upButtonId}"
                    type="button"
                    class="button secondary outlined">
                    Oben
                </button>
                <button
                    id="${downButtonId}"
                    type="button"
                    class="button secondary outlined">
                    Unten
                </button>
            </div> 
            <button
                id="${deleteButtonId}"
                type="button"
                class="button outlined error">
                Entfernen
            </button>
        `;

        const exerciseSelect = new ExerciseSelect(this.#exerciseId);

        if (this.#selectedExerciseId !== null) {
            exerciseSelect.selectedExerciseId = this.#selectedExerciseId;
            const exercise = await exercisesService.getUserOrGlobalExercise(this.#selectedExerciseId);
            this.shadowRoot.querySelector('h2').textContent = exercise.Name;
        }

        exerciseSelect.addEventListener('change', this.updateSelectedExercise);
        wrapper.appendChild(exerciseSelect);

        const setsWrapper = document.createElement('div');
        setsWrapper.classList.add(globalClassNames.inputWrapper);

        const setsLabel = document.createElement('label');
        setsLabel.setAttribute('for', setsInputName);
        setsLabel.textContent = 'Sätze';
        setsWrapper.appendChild(setsLabel);

        const setsInput = document.createElement('input');
        setsInput.name = setsInputName;
        setsInput.id = setsInputName;
        setsInput.type = 'number';
        setsInput.min = '1';
        setsInput.value = String(this.#setsAmount);
        setsInput.addEventListener('change', this.updateSetsAmount);
        setsWrapper.appendChild(setsInput);

        wrapper.appendChild(setsWrapper);

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
    async updateSelectedExercise(event) {
        if (event.currentTarget instanceof ExerciseSelect) {
            this.#selectedExerciseId = event.currentTarget.selectedExerciseId;
            const exercise = await exercisesService.getUserOrGlobalExercise(this.#selectedExerciseId);
            this.shadowRoot.querySelector('h2').textContent = exercise.Name;
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