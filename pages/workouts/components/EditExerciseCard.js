import '/models/Workout.js';
import '/models/Exercise.js';
import '/models/ExerciseResponse.js';
import { exercisesService } from '/services/ExercisesService.js';
import { ExerciseSelect } from '/components/ExerciseSelect.js';
import { globalClassNames, iconNames } from '/Constants.js';

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
    }

    async connectedCallback() {
        this.innerHTML = `
            <style>
                @import url('/globals.css');
                .card {
                   display: flex;
                   flex-direction: column;
                   gap: 0.5rem; 
                }
                .exerciseWrapper {
                   display: flex;
                   flex-direction: column;
                   gap: 0.5rem; 
                }
                .buttonsWrapper {
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                }
            </style>
            <li class="card">
                <div class="${globalClassNames.headerContainer}">
                    <h2>Unbekannte Übung</h2>
                </div>
                <div class="exerciseWrapper"></div>
            </li>
        `;

        this.#exerciseId = Number(this.getAttribute('exerciseId'));

        const wrapperId = `${this.#ids.exerciseWrapper}${this.#exerciseId}`;
        const upButtonId = `${this.#ids.upButton}${this.#exerciseId}`;
        const downButtonId = `${this.#ids.downButton}${this.#exerciseId}`;
        const deleteButtonId = `${this.#ids.deleteButton}${this.#exerciseId}`;
        const setsInputName = `${this.#inputNames.sets}${this.#exerciseId}`;

        const headerWrapper = this.querySelector(`.${globalClassNames.headerContainer}`);

        if (headerWrapper === null) {
            return;
        }

        headerWrapper.innerHTML = `
            <h2>Unbekannte Übung</h2>
            <div class="buttonsWrapper">
                <button
                    id="${upButtonId}"
                    type="button"
                    class="button outlined icon">
                    <fit-icon name="${iconNames.arrowUpFilled}"></fit-icon>
                </button>
                <button
                    id="${downButtonId}"
                    type="button"
                    class="button outlined icon">
                    <fit-icon name="${iconNames.arrowDownFilled}"></fit-icon>
                </button>
                <button
                    id="${deleteButtonId}"
                    type="button"
                    class="button outlined error icon">
                    <fit-icon name="${iconNames.deleteFilled}"></fit-icon>
                </button>
            </div> 
        `;

        const exerciseSelect = new ExerciseSelect(this.#exerciseId);

        if (this.#selectedExerciseId !== null) {
            exerciseSelect.selectedExerciseId = this.#selectedExerciseId;
            const exercise = await exercisesService.getUserOrGlobalExercise(this.#selectedExerciseId);

            if (exercise === undefined) {
                this.deleteExercise();
                return;
            }

            const header = this.querySelector('h2');
            if (header) {
                header.textContent = exercise.Name;
            }
        }

        const wrapper = this.querySelector('.exerciseWrapper');

        if (wrapper === null) {
            return;
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

        this.querySelector(`#${upButtonId}`)
            ?.addEventListener('click', this.moveUp);

        this.querySelector(`#${downButtonId}`)
            ?.addEventListener('click', this.moveDown);

        this.querySelector(`#${deleteButtonId}`)
            ?.addEventListener('click', this.deleteExercise);
    }

    /** @param {Event} event */
    async updateSelectedExercise(event) {
        if (event.currentTarget instanceof ExerciseSelect) {
            this.#selectedExerciseId = event.currentTarget.selectedExerciseId;

            if (this.#selectedExerciseId === null) {
                return;
            }

            const exercise = await exercisesService.getUserOrGlobalExercise(this.#selectedExerciseId);

            const header = this.querySelector('h2');
            if (header) {
                header.textContent = exercise?.Name ?? 'Unbekannte Übung';
            }
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