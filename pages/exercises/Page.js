import { appRouterIds } from '/Routes.js';
import { exercisesService } from '/services/ExercisesService.js';
import { AppRouterLink } from '/components/AppRouterLink.js';
import { buttonSizeClassNames, buttonVariantClassNames, errorMessages, globalClassNames, iconNames } from '/Constants.js';
import { Icon } from '/components/Icon.js';
import { styleSheetManager } from '/lib/StyleSheetManager.js';

export class ExercisesPage extends HTMLElement {
    #ids = {
        userExercises: 'userExercises',
        exercise: 'exercise',
    };

    constructor() {
        super();

        this.search = this.search.bind(this);

        const componentStyleSheet = new CSSStyleSheet();
        componentStyleSheet.replaceSync(`
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
        `);

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [styleSheetManager.sheet, componentStyleSheet];

        shadow.innerHTML = `
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
                <input placeholder="Suchen..." />
                <ul id="${this.#ids.userExercises}"></ul>
            </div>
        `;
    }

    connectedCallback() {
        this.#displayUserExercises();
        this.shadowRoot?.querySelector('input')?.addEventListener('input', this.search);
    }

    /** @param {InputEvent} event  */
    search(event) {
        const input = event.target;
        if (!(input instanceof HTMLInputElement)) {
            throw new Error(errorMessages.unexpectedType);
        }
        this.#displayUserExercises(input.value);
    }

    /** @param {string} [searchQuery]  */
    async #displayUserExercises(searchQuery) {
        const exercises = await exercisesService.getUserExercisesSortedAndFiltered(searchQuery);

        const exercisesElement = this.shadowRoot?.getElementById(this.#ids.userExercises);

        if (!exercisesElement) {
            return;
        }

        exercisesElement.innerHTML = '';

        if (exercises.length === 0) {
            const emptyTextElement = document.createElement('p');
            const isSearchQuery = searchQuery !== undefined && searchQuery !== '';
            emptyTextElement.textContent = isSearchQuery ? 'Gib einen anderen Suchbegriff ein' : 'Du hast bisher noch keine Übung erstellt.';
            exercisesElement.appendChild(emptyTextElement);
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
}

customElements.define('fit-exercises-page', ExercisesPage);