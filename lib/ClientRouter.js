import { appRouterIds } from '../Routes.js';
import '../models/Route.js';

export class ClientRouter {

    /** @type {Route[]} */
    #routes;

    /** @type {HTMLElement} */
    #outlet;

    /** @type {Route | undefined} */
    #activeRoute;

    /** @param {Route[]} routes */
    constructor(routes) {
        this.#routes = routes;
    }

    get activeRoute() {
        return this.#activeRoute;
    }

    /** @param {HTMLElement} outletParent  */
    set outlet(outletParent) {
        this.#outlet = outletParent.shadowRoot.getElementById('router-outlet');

        const currentRoute = this.#routes.find((route) => route.path === window.location.pathname);

        if (!currentRoute) {
            this.navigate(appRouterIds.home);
            return;
        }

        this.navigate(currentRoute.id);
    }

    /** @param {string} routeId */
    navigate(routeId) {
        const foundRoute = this.#routes.find((route) => route.id === routeId);

        if (!foundRoute) {
            console.error(`Route ID not found in registered routes: "${routeId}"`);
            return;
        }

        if (!this.#activeRoute || foundRoute.id !== this.#activeRoute.id) {
            this.#outlet.innerHTML = foundRoute.component;
            window.history.pushState({}, '', foundRoute.path);
            this.#activeRoute = foundRoute;
        }
    }

    /** @param {string} routeId  */
    getRoute(routeId) {
        return this.#routes.find((route) => route.id === routeId);
    }
}