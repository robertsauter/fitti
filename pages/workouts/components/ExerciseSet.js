import '/models/Workout.js';
import '/models/Exercise.js';
import '/models/ExerciseResponse.js';
import { workoutsStartStore } from '/store/WorkoutsStartStore.js';
import { customEventNames, globalClassNames } from '/Constants.js';

export class ExerciseSet extends HTMLElement {
    #inputNames = {
        weight: 'weight',
        reps: 'reps',
    };

    /** @type {number | string} */
    #exerciseId;
    /** @type {number} */
    #setIndex;
    /** @type {WorkoutStartSet} */
    #set;

    /** @param {number} index  */
    set setIndex(index) {
        this.#setIndex = index;
        this.#updateTitle();
    }

    /** 
     * @param {number | string} exerciseId 
     * @param {number} setIndex
     * @param {WorkoutStartSet} set 
     * */
    constructor(exerciseId, setIndex, set) {
        super();

        this.removeSet = this.removeSet.bind(this);
        this.updateWeight = this.updateWeight.bind(this);
        this.updateReps = this.updateReps.bind(this);

        this.#exerciseId = exerciseId;
        this.#setIndex = setIndex;
        this.#set = set;

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
                li {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
            </style>
            <li class="card white">
                <p>Set ${setIndex + 1}</p>
                <div class="${globalClassNames.inputWrapper}">
                    <label class="weightLabel">Gewicht</label>
                    <input class="weightInput" type="number" min="1" />
                </div>
                <div class="${globalClassNames.inputWrapper}">
                    <label class="repsLabel">Wiederholungen</label>
                    <input class="repsInput" type="number" min="1" />
                </div>
                ${this.#setIndex !== 0 ? `<button type="button" class="button secondary outlined">Set entfernen</button>` : ``}
            </li>
        `;
    }

    connectedCallback() {
        const weightInputName = `${this.#inputNames.weight}${this.#exerciseId}${this.#setIndex}`;

        this.shadowRoot
            .querySelector('.weightLabel')
            .setAttribute('for', weightInputName);

        const weightInput = this.shadowRoot.querySelector('.weightInput');
        if (weightInput instanceof HTMLInputElement) {
            weightInput.name = weightInputName;
            weightInput.id = weightInputName;
            weightInput.addEventListener('change', this.updateWeight);

            if (this.#set.weight !== null) {
                weightInput.value = String(this.#set.weight);
            }
        }

        const repsInputName = `${this.#inputNames.reps}${this.#exerciseId}${this.#setIndex}`;

        this.shadowRoot
            .querySelector('.repsLabel')
            .setAttribute('for', repsInputName);

        const repsInput = this.shadowRoot.querySelector('.repsInput');
        if (repsInput instanceof HTMLInputElement) {
            repsInput.name = repsInputName;
            repsInput.id = repsInputName;
            repsInput.addEventListener('change', this.updateReps);

            if (this.#set.reps !== null) {
                repsInput.value = String(this.#set.reps);
            }
        }

        const removeButton = this.shadowRoot.querySelector('button');

        if (removeButton !== null) {
            removeButton.addEventListener('click', this.removeSet);
        }
    }

    /**
     * @param {Event} event 
     */
    updateWeight(event) {
        const input = event.currentTarget;

        if (!(input instanceof HTMLInputElement)) {
            return;
        }

        workoutsStartStore.updateWeight(String(this.#exerciseId), this.#setIndex, Number(input.value));
    }

    /**
     * @param {Event} event 
     */
    updateReps(event) {
        const input = event.currentTarget;

        if (!(input instanceof HTMLInputElement)) {
            return;
        }

        workoutsStartStore.updateReps(String(this.#exerciseId), this.#setIndex, Number(input.value));
    }

    removeSet() {
        this.dispatchEvent(new CustomEvent(customEventNames.remove, { detail: this.#setIndex }));
    }

    #updateTitle() {
        this.shadowRoot.querySelector('p').textContent = `Set ${this.#setIndex + 1}`;
    }
}

customElements.define('fit-exercise-set', ExerciseSet);