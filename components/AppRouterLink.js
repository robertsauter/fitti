import { ClientRouter } from '/lib/ClientRouter.js';
import '/models/Route.js';
import { appRouter } from '/Routes.js';

export class AppRouterLink extends HTMLElement {
    /** @type {string} */
    #routeId;

    /** @type {Map<string, string> | undefined} */
    #params;

    constructor() {
        super();

        this.navigate = this.navigate.bind(this);

        this.#routeId = this.getAttribute('route');

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                a {
                    display: block;
                    text-align: center;
                }
            </style>
            <a part="link">${this.textContent}</a>
        `;

        this.textContent = '';
    }

    connectedCallback() {
        this.shadowRoot.querySelector('a').addEventListener('click', this.navigate);

        this.#setupRoute();
    }

    #setupRoute() {
        const foundRoute = appRouter.getRoute(this.#routeId);

        if (!foundRoute) {
            return;
        }

        let path = foundRoute.path;
        const params = new Map();
        for (let dataAttribute in this.dataset) {
            const keyParam = `:${dataAttribute}`

            if (path.includes(keyParam)) {
                path = path.replace(keyParam, this.dataset[dataAttribute]);
                params.set(dataAttribute, this.dataset[dataAttribute]);
            }
        }

        if (params.size > 0) {
            this.#params = params;
        }

        this.shadowRoot.querySelector('a').href = path;
    }

    /** @param {PointerEvent} event  */
    navigate(event) {
        event.preventDefault();

        if (!this.#routeId) {
            return;
        }

        appRouter.navigate(this.#routeId, false, this.#params);
    }
}

customElements.define('fit-app-router-link', AppRouterLink);