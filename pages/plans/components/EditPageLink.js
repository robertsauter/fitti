import { appRouter, appRouterIds } from '/Routes.js';
import { Link } from '/components/Link.js';

export class PlansEditPageLink extends HTMLElement {
    /** @type {string} */
    #planId;

    constructor() {
        super();

        this.#planId = this.getAttribute('planId');

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <fit-link route="${appRouterIds.plansEdit}">${this.textContent}</fit-link>
        `;

        this.textContent = '';
    }

    connectedCallback() {
        /** @type {Link} */
        const link = this.shadowRoot.querySelector('fit-link');

        const params = new Map();
        params.set('id', this.#planId);
        link.params = params;

        link.router = appRouter;
    }
}

customElements.define('fit-plans-edit-page-link', PlansEditPageLink);