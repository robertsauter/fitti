import { ClientRouter } from '../lib/ClientRouter.js';
import '../models/Route.js';

export class Link extends HTMLElement {
    /** @type {string} */
    #routeId;
    /** @type {ClientRouter} */
    #router;
    /** @type {Map<string, string> | undefined} */
    #params;

    /** @param {ClientRouter} routerInstance  */
    set router(routerInstance) {
        this.#router = routerInstance;

        const foundRoute = this.#router.getRoute(this.#routeId);

        if (!foundRoute) {
            return;
        }

        let path = foundRoute.path;

        if (this.#params) {
            this.#params.forEach((value, key) => {
                const keyParam = `:${key}`

                if (path.includes(keyParam)) {
                    path = path.replace(keyParam, value);
                }
            });
        }

        this.shadowRoot.querySelector('a').href = path;
    }

    /** @param {Map<string, string>} newParams  */
    set params(newParams) {
        this.#params = newParams;
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

        this.#router.navigate(this.#routeId, false, this.#params);
    }
}

customElements.define('fit-link', Link);