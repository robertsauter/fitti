import { appRouter, appRouterIds } from '/Routes.js';
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

    #classes = {
        pageWrapper: 'pageWrapper',
        buttonsWrapper: 'buttonsWrapper',
    };

    constructor() {
        super();

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
                li {
                   padding: 1rem;
                   background-color: white;
                   border-radius: 1rem;
                   display: flex;
                   flex-direction: column;
                   gap: 0.5rem; 
                }
                .${this.#classes.pageWrapper} {
                    display: flex;
                    gap: 1.5rem;
                    flex-direction: column;
                }
                .${this.#classes.buttonsWrapper} {
                    display: flex;
                    gap: 0.5rem;
                    justify-content: flex-end;
                }
                ul {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
            </style>
            <div class="${globalClassNames.pageContainer}">
                <div class="${this.#classes.pageWrapper}">
                    <div class="${globalClassNames.headerContainer}">
                        <h1>Übungen</h1>
                        <fit-app-router-link route="${appRouterIds.exercisesAdd}">Übung hinzufügen</fit-app-router-link>
                    </div>
                    <details open>
                        <summary>Ausgewählte Übungen</summary>
                        <ul id="${this.#ids.globalExercises}"></ul>
                    </details>
                    <details open>
                        <summary>Deine Übungen</summary>
                        <ul id="${this.#ids.userExercises}"></ul>
                    </details>
                </div>
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
            nameElement.textContent = exercise.Name;
            exerciseElement.appendChild(nameElement);

            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = exercise.Description;
            exerciseElement.appendChild(descriptionElement);

            const buttonsWrapper = document.createElement('div');
            buttonsWrapper.className = this.#classes.buttonsWrapper;

            const historyLink = new AppRouterLink(appRouterIds.exerciseHistory, 'Fortschritt');
            historyLink.setAttribute('data-id', exercise.ID);
            historyLink.setAttribute('color', buttonColorClassNames.secondary);
            buttonsWrapper.appendChild(historyLink);

            exerciseElement.appendChild(buttonsWrapper);

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

            const buttonsWrapper = document.createElement('div');
            buttonsWrapper.className = this.#classes.buttonsWrapper;

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.textContent = 'Löschen';
            deleteButton.className = 'button warning outlined';
            deleteButton.addEventListener('click', () => this.#deleteExercise(exercise.ID));
            buttonsWrapper.appendChild(deleteButton);

            const editLink = new AppRouterLink(appRouterIds.exercisesEdit, 'Bearbeiten');
            editLink.setAttribute('data-id', String(exercise.ID));
            editLink.setAttribute('color', buttonColorClassNames.secondary);
            editLink.setAttribute('variant', buttonVariantClassNames.outlined);
            buttonsWrapper.appendChild(editLink);

            const historyLink = new AppRouterLink(appRouterIds.exerciseHistory, 'Fortschritt');
            historyLink.setAttribute('data-id', String(exercise.ID));
            historyLink.setAttribute('color', buttonColorClassNames.secondary);
            buttonsWrapper.appendChild(historyLink);

            exerciseElement.appendChild(buttonsWrapper);

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