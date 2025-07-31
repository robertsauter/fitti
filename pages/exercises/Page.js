import { appRouterIds } from '/Routes.js';
import { exercisesService } from '/services/ExercisesService.js';
import { AppRouterLink } from '/components/AppRouterLink.js';
import { buttonSizeClassNames, buttonVariantClassNames, globalClassNames, iconNames } from '/Constants.js';
import { Icon } from '/components/Icon.js';

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
                    <div class="${globalClassNames.titleWrapper}">
                        <div class="${globalClassNames.emojiCircle}">
                            <fit-icon name="${iconNames.bicepEmoji}"></fit-icon>
                        </div>
                        <h1>Übungen</h1>
                    </div>
                    <fit-app-router-link route="${appRouterIds.exercisesAdd}" size="${buttonSizeClassNames.icon}">
                        <fit-icon name="${iconNames.add}"></fit-icon>
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

            const nameElement = document.createElement('h2');
            nameElement.textContent = exercise.Name;
            exerciseElement.appendChild(nameElement);

            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = exercise.Description;
            exerciseElement.appendChild(descriptionElement);

            const historyLink = new AppRouterLink(appRouterIds.exerciseHistory, `
                Fortschritt
                <fit-icon name="${iconNames.rocket}"></fit-icon>
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
            headerWrapper.className = globalClassNames.headerContainer;

            const nameElement = document.createElement('h2');
            nameElement.textContent = exercise.Name;
            headerWrapper.appendChild(nameElement);

            const buttonsWrapper = document.createElement('div');
            buttonsWrapper.className = 'buttonsWrapper';

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.innerHTML = `<fit-icon name="${iconNames.deleteFilled}"></fit-icon>`
            deleteButton.className = 'button error outlined icon';
            deleteButton.addEventListener('click', () => this.#deleteExercise(exercise.ID));
            buttonsWrapper.appendChild(deleteButton);

            const editLink = new AppRouterLink(
                appRouterIds.exercisesEdit,
                `<fit-icon name="${iconNames.editFilled}"></fit-icon>`
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
                <fit-icon name="${iconNames.rocket}"></fit-icon>
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