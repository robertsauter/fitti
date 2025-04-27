import { objectStoreNames } from '../../../Constants.js';
import { promiseIndexedDB } from '../../../lib/PromiseIndexedDB.js';
import { appRouter, appRouterIds } from '../../../Routes.js';

export class ExercisesAddPage extends HTMLElement {
    #ids = {
        createExerciseForm: 'createExerciseForm'
    };

    constructor() {
        super();

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <div class="page-container">
                <h2>Übung hinzufügen</h2>
                <form id="${this.#ids.createExerciseForm}">
                    <label for="name">Name</label>
                    <input id="name" name="name" type="text" required />
                    <label for="description">Beschreibung</label>
                    <textarea id="description" name="description" required></textarea>
                    <button type="submit">Speichern</button>
                </form>
            </div>
        `;
    }

    connectedCallback() {
        this.shadowRoot
            .getElementById(this.#ids.createExerciseForm)
            .addEventListener('submit', this.#saveExercise);
    }

    /** @param {SubmitEvent} event  */
    #saveExercise(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        promiseIndexedDB.add(objectStoreNames.userExercises, {
            Name: formData.get('name'),
            Description: formData.get('description')
        });
        appRouter.navigate(appRouterIds.exercises);
    }
}

customElements.define('fit-exercises-add-page', ExercisesAddPage);