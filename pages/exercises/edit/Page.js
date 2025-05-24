import { appRouter, appRouterIds } from '/Routes.js';
import { exercisesService } from '/services/ExercisesService.js';

export class ExercisesEditPage extends HTMLElement {
    #ids = {
        saveExerciseForm: 'saveExerciseForm'
    };

    #inputNames = {
        name: 'name',
        description: 'description'
    };

    /** @type {number | null} */
    #exerciseId = null;

    constructor() {
        super();

        this.saveExercise = this.saveExercise.bind(this);

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <div class="pageContainer">
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
                        required></textarea>
                    <button type="submit">Speichern</button>
                </form>
            </div>
        `;
    }

    connectedCallback() {
        this.shadowRoot
            .getElementById(this.#ids.saveExerciseForm)
            .addEventListener('submit', this.saveExercise);

        const id = appRouter.getParamValue('id');

        if (id !== null) {
            this.#exerciseId = Number(id);
            this.#fillData();
        }
    }

    async #fillData() {
        const exercise = await exercisesService.getUserExercise(this.#exerciseId);

        const nameInput = this.shadowRoot.getElementById(this.#inputNames.name);

        if (nameInput instanceof HTMLInputElement) {
            nameInput.value = exercise.Name;
        }

        const descriptionInput = this.shadowRoot.getElementById(this.#inputNames.description);

        if (descriptionInput instanceof HTMLTextAreaElement) {
            descriptionInput.value = exercise.Description;
        }
    }

    /** @param {SubmitEvent} event  */
    async saveExercise(event) {
        event.preventDefault();

        if (!(event.currentTarget instanceof HTMLFormElement)) {
            return;
        }

        const formData = new FormData(event.currentTarget);

        if (this.#exerciseId === null) {
            await exercisesService.addUserExercise({
                Name: formData.get(this.#inputNames.name).toString(),
                Description: formData.get(this.#inputNames.description).toString(),
            });
        } else {
            await exercisesService.putUserExercise({
                ID: this.#exerciseId,
                Name: formData.get(this.#inputNames.name).toString(),
                Description: formData.get(this.#inputNames.description).toString(),
            });
        }

        appRouter.navigate(appRouterIds.exercises);
    }
}

customElements.define('fit-exercises-edit-page', ExercisesEditPage);