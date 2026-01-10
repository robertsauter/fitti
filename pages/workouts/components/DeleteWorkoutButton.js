import { iconNames } from '/Constants.js';
import { styleSheetManager } from '/lib/StyleSheetManager.js';
import { appRouter, appRouterIds } from '/Routes.js';
import { workoutsService } from '/services/WorkoutsService.js';

export class DeleteWorkoutButton extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [styleSheetManager.sheet];

        shadow.innerHTML = `
            <button class="button error icon">
                <fit-icon name="${iconNames.delete}"></fit-icon>
            </button>
        `
    }

    connectedCallback() {
        this.shadowRoot
            ?.querySelector('button')
            ?.addEventListener('click', this.deleteWorkout);
    }

    async deleteWorkout() {
        const id = appRouter.getParamValue('id');

        if (id === null) {
            return;
        }

        await workoutsService.deleteUserWorkout(Number(id));

        appRouter.navigate(appRouterIds.workouts);
    }
}

customElements.define('fit-delete-workout-button', DeleteWorkoutButton);