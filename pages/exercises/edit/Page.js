import { appRouter, appRouterIds } from '../../../Routes.js';
import { exercisesService } from '../../../services/ExercisesService.js';

export class ExercisesEditPage extends HTMLElement {
    #ids = {
        saveExerciseForm: 'saveExerciseForm'
    };

    #inputNames = {
        name: 'name',
        description: 'description'
    }

    /** @type {number} */
    #exerciseId;

    constructor() {
        super();

        this.saveExercise = this.saveExercise.bind(this);

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <div class="page-container">
                <h2>Übung bearbeiten</h2>
                <form id="${this.#ids.saveExerciseForm}">
                    <label for="${this.#inputNames.name}">Name</label>
                    <input
                        id="${this.#inputNames.name}"
                        name="${this.#inputNames.name}"
                        type="text"
                        required />
                    <label for="${this.#inputNames.description}">Beschreibung</label>
                    <textarea
                        id="${this.#inputNames.description}"
                        name="${this.#inputNames.description}"
                        required>
                    </textarea>
                    <button type="submit">Speichern</button>
                </form>
            </div>
        `;
    }

    connectedCallback() {
        this.shadowRoot
            .getElementById(this.#ids.saveExerciseForm)
            .addEventListener('submit', this.saveExercise);

        this.#exerciseId = Number(appRouter.getParamValue('id'));

        this.#fillData();
    }

    async #fillData() {
        const exercise = await exercisesService.getUserExercise(this.#exerciseId);

        /** @type {HTMLInputElement} */
        const nameInput = this.shadowRoot.getElementById(this.#inputNames.name);
        nameInput.value = exercise.Name;

        /** @type {HTMLTextAreaElement} */
        const descriptionInput = this.shadowRoot.getElementById(this.#inputNames.description);
        descriptionInput.value = exercise.Description;
    }

    /** @param {SubmitEvent} event  */
    async saveExercise(event) {
        event.preventDefault();

        if (this.#exerciseId === undefined) {
            return;
        }

        const formData = new FormData(event.currentTarget);
        await exercisesService.putUserExercise({
            ID: this.#exerciseId,
            Name: formData.get(this.#inputNames.name).toString(),
            Description: formData.get(this.#inputNames.description).toString(),
        });

        appRouter.navigate(appRouterIds.exercises);
    }
}

customElements.define('fit-exercises-edit-page', ExercisesEditPage);