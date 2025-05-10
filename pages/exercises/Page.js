import { appRouter, appRouterIds } from '/Routes.js';
import { exercisesService } from '/services/ExercisesService.js';
import { Link } from '/components/Link.js';
import { ExercisesEditPageLink } from '/pages/exercises/components/EditPageLink.js';

export class ExercisesPage extends HTMLElement {
    #ids = {
        globalExercises: 'globalExercises',
        userExercises: 'userExercises',
        addExerciseButton: 'addExerciseButton',
        exercise: 'exercise',
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

        const exercisesElement = this.shadowRoot.getElementById(this.#ids.userExercises);
        exercises.forEach((exercise) => {
            const exerciseElement = document.createElement('li');
            exerciseElement.id = `${this.#ids.exercise}${exercise.ID}`;

            exerciseElement.innerHTML = `
                <h3>${exercise.Name}</h3>
                <p>${exercise.Description}</p>
                <button type="button">Löschen</button>
                <fit-exercises-edit-page-link exerciseId=${exercise.ID}>Bearbeiten</fit-exercises-edit-page-link>
            `;

            exerciseElement
                .querySelector('button')
                .addEventListener('click', () => this.#deleteExercise(exercise.ID));

            exercisesElement.appendChild(exerciseElement);
        });
    }

    /** @param {number} id  */
    async #deleteExercise(id) {
        await exercisesService.deleteUserExercise(id);
        this.shadowRoot
            .getElementById(`${this.#ids.exercise}${id}`)
            .remove();
    }
}

customElements.define('fit-exercises-page', ExercisesPage);