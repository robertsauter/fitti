import { appRouter, appRouterIds } from '../../Routes.js';
import { exercisesService } from '../../services/ExercisesService.js';
import { Link } from '../../components/Link.js';
import { ExercisesEditPageLink } from './components/EditPageLink.js';

export class ExercisesPage extends HTMLElement {
    #ids = {
        globalExercises: 'global-exercises',
        userExercises: 'user-exercises',
        addExerciseButton: 'add-exercise-button',
    }

    constructor() {
        super();

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <div class="page-container">
                <h2>Übungen</h2>
                <fit-link route="${appRouterIds.exercisesAdd}">Übung hinzufügen</fit-link>
                <details open>
                    <summary>Ausgewählte Übungen</summary>
                    <ul id="${this.#ids.globalExercises}"></ul>
                </details>
                <details open>
                    <summary>Deine Übungen</summary>
                    <ul id="${this.#ids.userExercises}"></ul>
                </details>
            </div>
        `;
    }

    connectedCallback() {
        this.#displayGlobalExercises();
        this.#displayUserExercises();

        /** @type {Link} */
        const link = this.shadowRoot.querySelector('fit-link');
        link.router = appRouter;
    }

    async #displayGlobalExercises() {
        const exercises = await exercisesService.getGlobalExercises();

        let exerciseElements = '';
        exercises.forEach((exercise) => {
            exerciseElements = `
                ${exerciseElements}
                <li>
                   <h3>${exercise.Name}</h6>
                   <p>${exercise.Description}</p>
                </li>
            `
        });

        this.shadowRoot.getElementById(this.#ids.globalExercises).innerHTML = exerciseElements;
    }

    async #displayUserExercises() {
        const exercises = await exercisesService.getUserExercises();

        let exerciseElements = '';
        exercises.forEach((exercise) => {
            exerciseElements = `
                ${exerciseElements}
                <li>
                   <h3>${exercise.Name}</h6>
                   <p>${exercise.Description}</p>
                   <fit-exercises-edit-page-link exerciseId=${exercise.ID}>Bearbeiten</fit-exercises-edit-page-link>
                </li>
            `
        });

        this.shadowRoot.getElementById(this.#ids.userExercises).innerHTML = exerciseElements;
    }
}

customElements.define('fit-exercises-page', ExercisesPage);