import { appRouter, appRouterIds } from '/Routes.js';
import { exercisesService } from '/services/ExercisesService.js';
import { AppRouterLink } from '/components/AppRouterLink.js';

export class ExercisesPage extends HTMLElement {
    #ids = {
        globalExercises: 'globalExercises',
        userExercises: 'userExercises',
        addExerciseButton: 'addExerciseButton',
        exercise: 'exercise',
    };

    constructor() {
        super();

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <div class="pageContainer">
                <h2>Übungen</h2>
                <fit-app-router-link route="${appRouterIds.exercisesAdd}">Übung hinzufügen</fit-app-router-link>
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
    }

    async #displayGlobalExercises() {
        const exercises = await exercisesService.getGlobalExercises();

        const globalExercisesElement = this.shadowRoot.getElementById(this.#ids.globalExercises);

        exercises.forEach((exercise) => {
            const exerciseElement = document.createElement('li');
            const nameElement = document.createElement('h3');
            const descriptionElement = document.createElement('p');

            nameElement.textContent = exercise.Name;
            descriptionElement.textContent = exercise.Description;

            exerciseElement.appendChild(nameElement);
            exerciseElement.appendChild(descriptionElement);

            globalExercisesElement.appendChild(exerciseElement);
        });
    }

    async #displayUserExercises() {
        const exercises = await exercisesService.getUserExercises();

        const exercisesElement = this.shadowRoot.getElementById(this.#ids.userExercises);

        exercises.forEach((exercise) => {
            const exerciseElement = document.createElement('li');
            exerciseElement.id = `${this.#ids.exercise}${exercise.ID}`;

            const nameElement = document.createElement('h3');
            nameElement.textContent = exercise.Name;
            exerciseElement.appendChild(nameElement);

            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = exercise.Description;
            exerciseElement.appendChild(descriptionElement);

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.textContent = 'Löschen';
            deleteButton.addEventListener('click', () => this.#deleteExercise(exercise.ID));
            exerciseElement.appendChild(deleteButton);

            exerciseElement.innerHTML += `<fit-app-router-link route="${appRouterIds.exercisesEdit}">Bearbeiten</fit-app-router-link>`;
            exerciseElement.querySelector('fit-app-router-link').setAttribute('data-id', String(exercise.ID));

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