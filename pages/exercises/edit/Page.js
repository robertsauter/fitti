import { globalClassNames, iconNames } from '/Constants.js';
import { appRouter, appRouterIds } from '/Routes.js';
import { exercisesService } from '/services/ExercisesService.js';
import { Icon } from '/components/Icon.js';

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
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
            </style>
            <div class="${globalClassNames.pageContainer}">
                <div class="${globalClassNames.titleWrapper}">
                    <div class="${globalClassNames.emojiCircle}">
                        <fit-icon name="${iconNames.bicepEmoji}"></fit-icon>
                        <fit-icon name="${iconNames.penEmoji}"></fit-icon>
                    </div>
                    <h1>Übung erstellen</h1>
                </div>
                <form id="${this.#ids.saveExerciseForm}">
                    <div class="${globalClassNames.inputWrapper}">
                        <label for="${this.#inputNames.name}">Name</label>
                        <input
                            id="${this.#inputNames.name}"
                            name="${this.#inputNames.name}"
                            type="text"
                            required />
                    </div>
                    <div class="${globalClassNames.inputWrapper}">
                        <label for="${this.#inputNames.description}">Beschreibung</label>
                        <textarea
                            id="${this.#inputNames.description}"
                            name="${this.#inputNames.description}"
                            required></textarea>
                    </div>
                    <button class="button textAndIcon" type="submit">
                        Speichern
                        <fit-icon name="${iconNames.save}"></fit-icon>
                    </button>
                </form>
            </div>
        `;
    }

    connectedCallback() {
        this.shadowRoot
            ?.getElementById(this.#ids.saveExerciseForm)
            ?.addEventListener('submit', this.saveExercise);

        const id = appRouter.getParamValue('id');

        if (id !== null) {
            const header = this.shadowRoot?.querySelector('h1');

            if (header) {
                header.textContent = 'Übung bearbeiten';
            }

            this.#exerciseId = Number(id);
            this.#fillData();
        }
    }

    async #fillData() {
        if (this.#exerciseId === null) {
            return;
        }

        const exercise = await exercisesService.getUserExercise(this.#exerciseId);

        if (exercise === undefined) {
            appRouter.navigate(appRouterIds.exercisesAdd);
            return;
        }

        const nameInput = this.shadowRoot?.getElementById(this.#inputNames.name);

        if (nameInput instanceof HTMLInputElement) {
            nameInput.value = exercise.Name;
        }

        const descriptionInput = this.shadowRoot?.getElementById(this.#inputNames.description);

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

        const name = formData.get(this.#inputNames.name)?.toString();
        const description = formData.get(this.#inputNames.description)?.toString();

        if (name === undefined || description === undefined) {
            return;
        }

        if (this.#exerciseId === null) {
            await exercisesService.addUserExercise({
                Name: name,
                Description: description,
            });
        } else {
            await exercisesService.putUserExercise({
                ID: this.#exerciseId,
                Name: name,
                Description: description,
            });
        }

        appRouter.navigate(appRouterIds.exercises);
    }
}

customElements.define('fit-exercises-edit-page', ExercisesEditPage);