import { ClientRouter } from '../lib/ClientRouter.js';
import '../models/Route.js';

export class Link extends HTMLElement {
    /** @type {string} */
    #routeId;
    /** @type {ClientRouter} */
    #router;

    /** @param {ClientRouter} routerInstance  */
    set router(routerInstance) {
        this.#router = routerInstance;

        const foundRoute = this.#router.getRoute(this.#routeId);

        if (!foundRoute) {
            return;
        }

        this.shadowRoot.querySelector('a').href = foundRoute.path;
    }

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
    }

    /** @param {PointerEvent} event  */
    navigate(event) {
        event.preventDefault();

        if (!this.#router || !this.#routeId) {
            return;
        }

        this.#router.navigate(this.#routeId);
    }
}

customElements.define('fit-link', Link);