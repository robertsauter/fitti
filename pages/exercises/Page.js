import { appRouterIds } from '/Routes.js';
import { exercisesService } from '/services/ExercisesService.js';
import { AppRouterLink } from '/components/AppRouterLink.js';
import { buttonSizeClassNames, buttonVariantClassNames, globalClassNames } from '/Constants.js';

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
                .headerWrapper {
                    display: flex;
                    justify-content: space-between;
                }
                .buttonsWrapper {
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
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
                    <fit-app-router-link route="${appRouterIds.exercisesAdd}" size="${buttonSizeClassNames.textAndIcon}">
                        Übung hinzufügen
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M10 2.5a.5.5 0 0 1 .5.5v6.5H17a.5.5 0 0 1 0 1h-6.5V17a.5.5 0 0 1-1 0v-6.5H3a.5.5 0 0 1 0-1h6.5V3a.5.5 0 0 1 .5-.5"/></svg>
                    </fit-app-router-link>
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

            const historyLink = new AppRouterLink(appRouterIds.exerciseHistory, `
                Fortschritt
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M10.755 6.426a1.998 1.998 0 1 1 2.825 2.827a1.998 1.998 0 0 1-2.825-2.827m2.119.708a.998.998 0 1 0-1.413 1.411a.998.998 0 0 0 1.413-1.411m-1.125 7.37a1.5 1.5 0 0 1-1.703-.295l-.61-.609l-.732 1.22a.5.5 0 0 1-.782.097l-2.83-2.831a.5.5 0 0 1 .096-.782l1.22-.732l-.61-.61a1.5 1.5 0 0 1-.295-1.703l-1.12-1.12a.5.5 0 0 1 0-.707l1.06-1.06a3 3 0 0 1 3.413-.589l.938-.937a6.29 6.29 0 0 1 6.33-1.557c.76.238 1.357.834 1.595 1.595a6.29 6.29 0 0 1-1.557 6.33l-.937.938a3 3 0 0 1-.59 3.413l-1.059 1.06a.5.5 0 0 1-.707 0zm4.076-11.26a5.29 5.29 0 0 0-5.324 1.309l-.816.815l.004.004l-.707.707l-.004-.004l-2.122 2.122l.004.004l-.403.403a.5.5 0 0 0 .048.651l4.248 4.247a.5.5 0 0 0 .652.047l.402-.401l.003.004l2.122-2.122l-.003-.004l.707-.707l.003.004l.816-.816a5.29 5.29 0 0 0 1.31-5.325a1.43 1.43 0 0 0-.94-.938m-3.307 10.615l.704.705l.707-.707a2 2 0 0 0 .52-1.93zm-4.438-8.3a2 2 0 0 0-1.93.52l-.706.707l.705.704zm.627 7.312l-1.57-1.57l-.886.53l1.925 1.926zm-2.904 2.04a.5.5 0 1 0-.707-.706l-1.768 1.768a.5.5 0 1 0 .707.707zM4.388 12.79a.5.5 0 0 1 0 .707l-.71.709a.5.5 0 0 1-.706-.708l.709-.708a.5.5 0 0 1 .707 0m2.83 3.537a.5.5 0 0 0-.707-.707l-.709.709a.5.5 0 1 0 .707.707z"/></svg>
            `);
            historyLink.setAttribute('size', buttonSizeClassNames.textAndIcon);
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

            const headerWrapper = document.createElement('div');
            headerWrapper.className = 'headerWrapper';

            const nameElement = document.createElement('h3');
            nameElement.textContent = exercise.Name;
            headerWrapper.appendChild(nameElement);

            const buttonsWrapper = document.createElement('div');
            buttonsWrapper.className = 'buttonsWrapper';

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M8.5 4h3a1.5 1.5 0 0 0-3 0m-1 0a2.5 2.5 0 0 1 5 0h5a.5.5 0 0 1 0 1h-1.054l-1.194 10.344A3 3 0 0 1 12.272 18H7.728a3 3 0 0 1-2.98-2.656L3.554 5H2.5a.5.5 0 0 1 0-1zM9 8a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0zm2.5-.5a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 1 0V8a.5.5 0 0 0-.5-.5"/></svg>
            `
            deleteButton.className = 'button error outlined icon';
            deleteButton.addEventListener('click', () => this.#deleteExercise(exercise.ID));
            buttonsWrapper.appendChild(deleteButton);

            const editLink = new AppRouterLink(
                appRouterIds.exercisesEdit,
                `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M12.92 2.873a2.975 2.975 0 0 1 4.207 4.207l-.669.669l-4.207-4.207zM11.544 4.25l-7.999 7.999a2.44 2.44 0 0 0-.655 1.194l-.878 3.95a.5.5 0 0 0 .597.597l3.926-.873a2.5 2.5 0 0 0 1.234-.678l7.982-7.982z"/></svg>`
            );
            editLink.setAttribute('data-id', String(exercise.ID));
            editLink.setAttribute('variant', buttonVariantClassNames.outlined);
            editLink.setAttribute('size', buttonSizeClassNames.icon);
            buttonsWrapper.appendChild(editLink);

            headerWrapper.appendChild(buttonsWrapper);
            exerciseElement.appendChild(headerWrapper);

            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = exercise.Description;
            exerciseElement.appendChild(descriptionElement);

            const historyLink = new AppRouterLink(appRouterIds.exerciseHistory, `
                Fortschritt
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M10.755 6.426a1.998 1.998 0 1 1 2.825 2.827a1.998 1.998 0 0 1-2.825-2.827m2.119.708a.998.998 0 1 0-1.413 1.411a.998.998 0 0 0 1.413-1.411m-1.125 7.37a1.5 1.5 0 0 1-1.703-.295l-.61-.609l-.732 1.22a.5.5 0 0 1-.782.097l-2.83-2.831a.5.5 0 0 1 .096-.782l1.22-.732l-.61-.61a1.5 1.5 0 0 1-.295-1.703l-1.12-1.12a.5.5 0 0 1 0-.707l1.06-1.06a3 3 0 0 1 3.413-.589l.938-.937a6.29 6.29 0 0 1 6.33-1.557c.76.238 1.357.834 1.595 1.595a6.29 6.29 0 0 1-1.557 6.33l-.937.938a3 3 0 0 1-.59 3.413l-1.059 1.06a.5.5 0 0 1-.707 0zm4.076-11.26a5.29 5.29 0 0 0-5.324 1.309l-.816.815l.004.004l-.707.707l-.004-.004l-2.122 2.122l.004.004l-.403.403a.5.5 0 0 0 .048.651l4.248 4.247a.5.5 0 0 0 .652.047l.402-.401l.003.004l2.122-2.122l-.003-.004l.707-.707l.003.004l.816-.816a5.29 5.29 0 0 0 1.31-5.325a1.43 1.43 0 0 0-.94-.938m-3.307 10.615l.704.705l.707-.707a2 2 0 0 0 .52-1.93zm-4.438-8.3a2 2 0 0 0-1.93.52l-.706.707l.705.704zm.627 7.312l-1.57-1.57l-.886.53l1.925 1.926zm-2.904 2.04a.5.5 0 1 0-.707-.706l-1.768 1.768a.5.5 0 1 0 .707.707zM4.388 12.79a.5.5 0 0 1 0 .707l-.71.709a.5.5 0 0 1-.706-.708l.709-.708a.5.5 0 0 1 .707 0m2.83 3.537a.5.5 0 0 0-.707-.707l-.709.709a.5.5 0 1 0 .707.707z"/></svg>
            `);
            historyLink.setAttribute('data-id', String(exercise.ID));
            historyLink.setAttribute('size', buttonSizeClassNames.textAndIcon);
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