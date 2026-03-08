import { AppRouterLink } from '/components/AppRouterLink.js';
import { buttonSizeClassNames, iconNames } from '/Constants.js';
import { styleSheetManager } from '/lib/StyleSheetManager.js';
import { appRouterIds } from '/Routes.js';

export class AddExerciseLink extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [styleSheetManager.sheet];

        shadow.innerHTML = `<fit-app-router-link route="${appRouterIds.exercisesAdd}" size="${buttonSizeClassNames.textAndIcon}">
            Übung erstellen
            <fit-icon name="${iconNames.add}"></fit-icon>
        </fit-app-router-link>`;
    }
}

customElements.define('fit-add-exercise-link', AddExerciseLink);