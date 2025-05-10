import { appRouter, appRouterIds } from '/Routes.js';
import { Link } from '/components/Link.js';

export class WorkoutsEditPageLink extends HTMLElement {
    /** @type {string} */
    #workoutId;

    constructor() {
        super();

        this.#workoutId = this.getAttribute('workoutId');

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <fit-link route="${appRouterIds.workoutsEdit}">${this.textContent}</fit-link>
        `;

        this.textContent = '';
    }

    connectedCallback() {
        /** @type {Link} */
        const link = this.shadowRoot.querySelector('fit-link');

        const params = new Map();
        params.set('id', this.#workoutId);
        link.params = params;

        link.router = appRouter;
    }
}

customElements.define('fit-workouts-edit-page-link', WorkoutsEditPageLink);