import { buttonColorClassNames, buttonVariantClassNames } from '/Constants.js';
import { ClientRouter } from '/lib/ClientRouter.js';
import '/models/Route.js';
import { appRouter } from '/Routes.js';

export class AppRouterLink extends HTMLElement {
    /** @type {string} */
    #routeId;

    /** @type {Map<string, string> | undefined} */
    #params;

    /** 
     * @param {string} [routeId]  
     * @param {string} [textContent] 
     * */
    constructor(routeId, textContent) {
        super();

        this.navigate = this.navigate.bind(this);

        this.#routeId = routeId ?? this.getAttribute('route');

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
                a {
                    display: block;
                    text-align: center;
                    text-decoration: none;
                }
            </style>
            <a part="link" class="button">${textContent ?? this.textContent}</a>
        `;

        this.textContent = '';
    }

    connectedCallback() {
        const link = this.shadowRoot.querySelector('a');

        link.addEventListener('click', this.navigate);

        const variant = this.getAttribute('variant');
        if (variant !== null && Object.hasOwn(buttonVariantClassNames, variant)) {
            link.classList.add(variant);
        }

        const color = this.getAttribute('color') ?? 'primary';
        if (Object.hasOwn(buttonColorClassNames, color)) {
            link.classList.add(color);
        }

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
            const keyParam = `:${dataAttribute}`;

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