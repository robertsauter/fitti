import { globalClassNames } from '/Constants.js';
import { exercisesService } from '/services/ExercisesService.js';

export class ExerciseSelect extends HTMLElement {
    #inputNames = {
        exercise: 'exercise',
    };

    /** @type {number} */
    #exerciseIndex;

    /** @type {number | null} */
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
    }

    async connectedCallback() {
        const exerciseSelectName = `${this.#inputNames.exercise}${this.#exerciseIndex}`;

        this.innerHTML = `
            <div class="${globalClassNames.inputWrapper}">
                <label for="${exerciseSelectName}">Übung</label>
                <select id="${exerciseSelectName}" name="${exerciseSelectName}" required></select>
            </div>
        `;

        const exerciseSelect = this.querySelector(`#${this.#inputNames.exercise}${this.#exerciseIndex}`);

        const userExercises = await exercisesService.getUserExercises();

        if (exerciseSelect instanceof HTMLSelectElement) {
            if (userExercises.length > 0) {
                userExercises.forEach((exercise) => {
                    const option = document.createElement('option');
                    option.value = String(exercise.ID);
                    option.textContent = exercise.Name;
                    exerciseSelect.appendChild(option);
                });
            }

            if (this.#selectedExerciseId !== null) {
                exerciseSelect.value = String(this.#selectedExerciseId);
            } else {
                exerciseSelect.value = '';
            }

            exerciseSelect.addEventListener('change', this.updateSelectedExercise);
        }
    }

    /** @param {Event} event */
    updateSelectedExercise(event) {
        const select = event.currentTarget;

        if (!(select instanceof HTMLSelectElement)) {
            return;
        }

        const form = select.form;

        if (form !== null) {
            let isValid = true;
            Object.values(form.elements).forEach((input) => {
                if (input instanceof HTMLSelectElement && input.name !== select.name && input.value === select.value) {
                    isValid = false;
                }
            });

            if (isValid) {
                this.resetValidation();
            } else {
                this.triggerExerciseInUseValidation();
            }
        }

        this.#selectedExerciseId = Number(select.value);
        this.dispatchEvent(new Event('change'));
    }

    triggerExerciseInUseValidation() {
        const select = this.querySelector('select');
        select?.setCustomValidity('Diese Übung wird schon verwendet.');
        select?.reportValidity();
    }

    resetValidation() {
        const select = this.querySelector('select');
        select?.setCustomValidity('');
    }
}

customElements.define('fit-exercise-select', ExerciseSelect);