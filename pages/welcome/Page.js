import { buttonSizeClassNames, errorMessages, globalClassNames, iconNames } from '/Constants.js';
import { styleSheetManager } from '/lib/StyleSheetManager.js';
import { Icon } from '/components/Icon.js';
import { AddExerciseLink } from '/components/AddExerciseLink.js';
import { ExercisesList } from '/pages/welcome/components/ExercisesList.js';
import { appRouterIds } from '/Routes.js';
import { AppRouterLink } from '/components/AppRouterLink.js';
import { exercisesService } from '/services/ExercisesService.js';

export class WelcomePage extends HTMLElement {
    constructor() {
        super();

        const componentStyleSheet = new CSSStyleSheet();
        componentStyleSheet.replaceSync(``);

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [styleSheetManager.sheet, componentStyleSheet];

        shadow.innerHTML = `
            <div class="${globalClassNames.pageContainer}">
                <div class="${globalClassNames.titleWrapper}">
                    <div class="${globalClassNames.emojiCircle}">
                        <fit-icon name="${iconNames.wavingHandEmoji}"></fit-icon>
                    </div>
                    <h1>Willkommen! Schön, dass du hier bist!</h1>
                </div>
                <p>Bevor du deine Workouts tracken kannst, musst du erstmal Übungen und Workouts erstellen.</p>
                <fit-exercises-list></fit-exercises-list>
            </div>
        `;
    }

    connectedCallback() {
        this.#displayAddWorkoutsButton();
    }

    async #displayAddWorkoutsButton() {
        const pageContainer = this.shadowRoot?.querySelector(`.${globalClassNames.pageContainer}`);

        if (!pageContainer) {
            throw new Error(errorMessages.elementNotFound);
        }

        const exercisesCount = await exercisesService.getExercisesCount();

        if (exercisesCount === 0) {
            return;
        }

        const addWorkoutButton = new AppRouterLink(appRouterIds.workoutsAdd, `
            Workout erstellen
            <fit-icon name="${iconNames.add}"></fit-icon>
        `);
        addWorkoutButton.setAttribute('size', buttonSizeClassNames.textAndIcon);
        pageContainer.appendChild(addWorkoutButton);
    }
}

customElements.define('fit-welcome-page', WelcomePage);