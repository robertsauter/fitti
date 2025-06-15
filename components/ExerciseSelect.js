import { globalClassNames } from '/Constants.js';
import { exercisesService } from '/services/ExercisesService.js';

export class ExerciseSelect extends HTMLElement {
    #inputNames = {
        exercise: 'exercise',
    };

    /** @type {number} */
    #exerciseIndex;

    /** @type {string | null} */
    #selectedExerciseId = null;

    get selectedExerciseId() {
        return this.#selectedExerciseId;
    }

    set selectedExerciseId(id) {
        this.#selectedExerciseId = id;
    }

    /** @param {number} exerciseIndex  */
    constructor(exerciseIndex) {
        super();

        this.updateSelectedExercise = this.updateSelectedExercise.bind(this);

        this.#exerciseIndex = exerciseIndex;

        const exerciseSelectName = `${this.#inputNames.exercise}${exerciseIndex}`;

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <div class="${globalClassNames.inputWrapper}">
                <label for="${exerciseSelectName}">Übung</label>
                <select id="${exerciseSelectName}" name="${exerciseSelectName}"></select>
            </div>
        `;
    }

    async connectedCallback() {
        const exerciseSelect = this.shadowRoot.getElementById(`${this.#inputNames.exercise}${this.#exerciseIndex}`);

        const globalExercises = await exercisesService.getGlobalExercises();
        const userExercises = await exercisesService.getUserExercises();

        if (exerciseSelect instanceof HTMLSelectElement) {
            if (globalExercises.length > 0) {
                const globalOptionGroup = document.createElement('optgroup');
                globalOptionGroup.label = 'Ausgewählte Übungen';

                globalExercises.forEach((exercise) => {
                    const option = document.createElement('option');
                    option.value = String(exercise.ID);
                    option.textContent = exercise.Name;
                    globalOptionGroup.appendChild(option);
                });

                exerciseSelect.appendChild(globalOptionGroup);
            }

            if (userExercises.length > 0) {
                const userOptionGroup = document.createElement('optgroup');
                userOptionGroup.label = 'Deine Übungen';
                userExercises.forEach((exercise) => {
                    const option = document.createElement('option');
                    option.value = String(exercise.ID);
                    option.textContent = exercise.Name;
                    userOptionGroup.appendChild(option);
                });

                exerciseSelect.appendChild(userOptionGroup);
            }

            if (this.#selectedExerciseId !== null) {
                exerciseSelect.value = this.#selectedExerciseId;
            } else {
                exerciseSelect.value = '';
            }

            exerciseSelect.addEventListener('change', this.updateSelectedExercise);
        }
    }

    /** @param {Event} event */
    updateSelectedExercise(event) {
        if (event.currentTarget instanceof HTMLSelectElement) {
            this.#selectedExerciseId = event.currentTarget.value;
            this.dispatchEvent(new Event('change'));
        }
    }
}

customElements.define('fit-exercise-select', ExerciseSelect);