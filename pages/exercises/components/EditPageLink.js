import { appRouter, appRouterIds } from '../../../Routes.js';
import { Link } from '../../../components/Link.js';

export class ExercisesEditPageLink extends HTMLElement {
    /** @type {string} */
    #exerciseId;

    constructor() {
        super();

        this.#exerciseId = this.getAttribute('exerciseId');

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <fit-link route="${appRouterIds.exercisesEdit}">${this.textContent}</fit-link>
        `;

        this.textContent = '';
    }

    connectedCallback() {
        /** @type {Link} */
        const link = this.shadowRoot.querySelector('fit-link');

        const params = new Map();
        params.set('id', this.#exerciseId);
        link.params = params;

        link.router = appRouter;
    }
}

customElements.define('fit-exercises-edit-page-link', ExercisesEditPageLink);