import { AppRouterLink } from '/components/AppRouterLink.js';
import { buttonSizeClassNames, buttonVariantClassNames, errorMessages, iconNames } from '/Constants.js';
import { styleSheetManager } from '/lib/StyleSheetManager.js';
import { appRouterIds } from '/Routes.js';
import { exercisesService } from '/services/ExercisesService.js';

export class AddExerciseLink extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [styleSheetManager.sheet];
    }

    connectedCallback() {
        this.#displayLink();
    }

    async #displayLink() {
        if (this.shadowRoot === null) {
            throw new Error(errorMessages.elementNotFound);
        }

        const exercisesCount = await exercisesService.getExercisesCount();
        const text = exercisesCount === 0 ? 'Übung erstellen' : 'Noch eine Übung erstellen';

        this.shadowRoot.innerHTML = `<fit-app-router-link
            route="${appRouterIds.exercisesAdd}"
            size="${buttonSizeClassNames.textAndIcon}"
            ${exercisesCount === 0 ? `` : `variant="${buttonVariantClassNames.outlined}"`}>
            ${text}
            <fit-icon name="${iconNames.add}"></fit-icon>
        </fit-app-router-link>`;
    }
}

customElements.define('fit-add-exercise-link', AddExerciseLink);