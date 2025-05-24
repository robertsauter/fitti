import '/models/Workout.js';
import { exercisesService } from '/services/ExercisesService.js';
import '/models/Exercise.js';
import '/models/ExerciseResponse.js';

export class ExerciseSet extends HTMLElement {
    #inputNames = {
        weight: 'weight',
        reps: 'reps',
    };

    #classes = {
        weightLabel: 'weightLabel',
        weightInput: 'weightInput',
        repsLabel: 'repsLabel',
        repsInput: 'repsInput',
    }

    /** @type {number | string} */
    #exerciseId;
    /** @type {number} */
    #setId;

    /** 
     * @param {number | string} exerciseId 
     * @param {number} setId 
     * */
    constructor(exerciseId, setId) {
        super();

        this.removeSet = this.removeSet.bind(this);

        this.#exerciseId = exerciseId;
        this.#setId = setId;

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <li>
                <p>Set ${setId}</p>
                <label class="${this.#classes.weightLabel}">Gewicht</label>
                <input class="${this.#classes.weightInput}" type="number" min="1" />
                <label class="${this.#classes.repsLabel}">Wiederholungen</label>
                <input class="${this.#classes.repsInput}" type="number" min="1" />
                <button type="button">Set entfernen</button>
            </li>
        `;
    }

    connectedCallback() {
        const weightInputName = `${this.#inputNames.weight}${this.#exerciseId}${this.#setId}`;

        this.shadowRoot
            .querySelector(`.${this.#classes.weightLabel}`)
            .setAttribute('for', weightInputName);

        const weightInput = this.shadowRoot.querySelector(`.${this.#classes.weightInput}`);
        if (weightInput instanceof HTMLInputElement) {
            weightInput.name = weightInputName;
            weightInput.id = weightInputName;
        }

        const repsInputName = `${this.#inputNames.reps}${this.#exerciseId}${this.#setId}`;

        this.shadowRoot
            .querySelector(`.${this.#classes.repsLabel}`)
            .setAttribute('for', repsInputName);

        const repsInput = this.shadowRoot.querySelector(`.${this.#classes.repsInput}`);
        if (repsInput instanceof HTMLInputElement) {
            repsInput.name = repsInputName;
            repsInput.id = repsInputName;
        }

        this.shadowRoot
            .querySelector('button')
            .addEventListener('click', this.removeSet);
    }

    removeSet() {
        this.remove();
    }
}

customElements.define('fit-exercise-set', ExerciseSet);