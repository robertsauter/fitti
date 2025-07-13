import { appRouterIds } from '/Routes.js';
import { exercisesService } from '/services/ExercisesService.js';
import { AppRouterLink } from '/components/AppRouterLink.js';
import { buttonColorClassNames, buttonVariantClassNames, globalClassNames } from '/Constants.js';

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
                .card {
                   display: flex;
                   flex-direction: column;
                   gap: 0.5rem; 
                }
                .buttonsWrapper {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.5rem;
                }
                ul {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
            </style>
            <div class="${globalClassNames.pageContainer}">
                <div class="${globalClassNames.headerContainer}">
                    <h1>Übungen</h1>
                    <fit-app-router-link route="${appRouterIds.exercisesAdd}">Übung erstellen</fit-app-router-link>
                </div>
                <details open>
                    <summary>Deine Übungen</summary>
                    <ul id="${this.#ids.userExercises}"></ul>
                </details>
                <details open>
                    <summary>Ausgewählte Übungen</summary>
                    <ul id="${this.#ids.globalExercises}"></ul>
                </details>
            </div>
        `;
    }

    connectedCallback() {
        this.#displayUserExercises();
        this.#displayGlobalExercises();
    }

    async #displayGlobalExercises() {
        const exercises = await exercisesService.getGlobalExercises();

        const globalExercisesElement = this.shadowRoot?.getElementById(this.#ids.globalExercises);

        if (!globalExercisesElement) {
            return;
        }

        exercises.forEach((exercise) => {
            const exerciseElement = document.createElement('li');
            exerciseElement.className = 'card';

            const nameElement = document.createElement('h3');
            nameElement.textContent = exercise.Name;
            exerciseElement.appendChild(nameElement);

            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = exercise.Description;
            exerciseElement.appendChild(descriptionElement);

            const historyLink = new AppRouterLink(appRouterIds.exerciseHistory, 'Fortschritt');
            historyLink.setAttribute('data-id', exercise.ID);
            exerciseElement.appendChild(historyLink);


            globalExercisesElement.appendChild(exerciseElement);
        });
    }

    async #displayUserExercises() {
        const exercises = await exercisesService.getUserExercises();

        const exercisesElement = this.shadowRoot?.getElementById(this.#ids.userExercises);

        if (!exercisesElement) {
            return;
        }

        exercises.forEach((exercise) => {
            const exerciseElement = document.createElement('li');
            exerciseElement.id = `${this.#ids.exercise}${exercise.ID}`;
            exerciseElement.className = 'card';

            const nameElement = document.createElement('h3');
            nameElement.textContent = exercise.Name;
            exerciseElement.appendChild(nameElement);

            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = exercise.Description;
            exerciseElement.appendChild(descriptionElement);

            const buttonsWrapper = document.createElement('div');
            buttonsWrapper.className = 'buttonsWrapper';

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.textContent = 'Löschen';
            deleteButton.className = 'button error outlined';
            deleteButton.addEventListener('click', () => this.#deleteExercise(exercise.ID));
            buttonsWrapper.appendChild(deleteButton);

            const editLink = new AppRouterLink(appRouterIds.exercisesEdit, 'Bearbeiten');
            editLink.setAttribute('data-id', String(exercise.ID));
            editLink.setAttribute('variant', buttonVariantClassNames.outlined);
            buttonsWrapper.appendChild(editLink);

            exerciseElement.appendChild(buttonsWrapper);

            const historyLink = new AppRouterLink(appRouterIds.exerciseHistory, 'Fortschritt');
            historyLink.setAttribute('data-id', String(exercise.ID));
            exerciseElement.appendChild(historyLink);

            exercisesElement.appendChild(exerciseElement);
        });
    }

    /** @param {number} id  */
    async #deleteExercise(id) {
        await exercisesService.deleteUserExercise(id);
        this.shadowRoot
            ?.getElementById(`${this.#ids.exercise}${id}`)
            ?.remove();
    }
}

customElements.define('fit-exercises-page', ExercisesPage);