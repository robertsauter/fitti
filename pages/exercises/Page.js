import { appRouter, appRouterIds } from '../../Routes.js';
import { exercisesService } from '../../services/ExercisesService.js';
import { Link } from '../../components/Link.js';

export class ExercisesPage extends HTMLElement {
    #ids = {
        globalExercises: 'global-exercises',
        addExerciseButton: 'add-exercise-button',
    }

    constructor() {
        super();

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <div class="page-container">
                <fit-link route="${appRouterIds.exercisesAdd}">Übung hinzufügen</fit-link>
                <details open>
                    <summary>Ausgewählte Übungen</summary>
                    <ul id="${this.#ids.globalExercises}"></ul>
                </details>
                <details open>
                    <summary>Deine Übungen</summary>
                    <ul id="user-exercises"></ul>
                </details>
            </div>
        `;
    }

    connectedCallback() {
        this.#displayGlobalExercises();

        /** @type {NodeListOf<Link>} */
        const links = this.shadowRoot.querySelectorAll('fit-link');
        links.forEach((link) => link.router = appRouter);
    }

    async #displayGlobalExercises() {
        const exercises = await exercisesService.getGlobalExercises();

        let exerciseElements = '';
        exercises.forEach((exercise) => {
            exerciseElements = `
                ${exerciseElements}
                <li>
                   <h6>${exercise.Name}</h6>
                   <p>${exercise.Description}</p>
                </li>
            `
        });

        this.shadowRoot.getElementById(this.#ids.globalExercises).innerHTML = exerciseElements;
    }
}

customElements.define('fit-exercises-page', ExercisesPage);