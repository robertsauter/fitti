import { appRouter, appRouterIds } from '/Routes.js';
import { exercisesService } from '/services/ExercisesService.js';

export class ExercisesAddPage extends HTMLElement {
    #ids = {
        createExerciseForm: 'createExerciseForm'
    };

    #inputNames = {
        name: 'name',
        description: 'description'
    }

    constructor() {
        super();

        this.saveExercise = this.saveExercise.bind(this);

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <div class="page-container">
                <h2>Übung hinzufügen</h2>
                <form id="${this.#ids.createExerciseForm}">
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
            .getElementById(this.#ids.createExerciseForm)
            .addEventListener('submit', this.saveExercise);
    }

    /** @param {SubmitEvent} event  */
    async saveExercise(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        await exercisesService.addUserExercise({
            Name: formData.get('name').toString(),
            Description: formData.get('description').toString(),
        });

        appRouter.navigate(appRouterIds.exercises);
    }
}

customElements.define('fit-exercises-add-page', ExercisesAddPage);