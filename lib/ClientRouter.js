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

        this.#findCurrentRouteAndNavigate();

        window.addEventListener('popstate', () => {
            this.#findCurrentRouteAndNavigate(true);
        });
    }

    /**
     * @param {string} routeId 
     * @param {boolean} [keepHistory]
     * */
    navigate(routeId, keepHistory) {
        const foundRoute = this.#routes.find((route) => route.id === routeId);

        if (!foundRoute) {
            console.error(`Route ID not found in registered routes: "${routeId}"`);
            return;
        }

        if (!this.#activeRoute || foundRoute.id !== this.#activeRoute.id) {
            this.#outlet.innerHTML = foundRoute.component;

            if (!keepHistory) {
                window.history.pushState({}, '', foundRoute.path);
            }

            this.#activeRoute = foundRoute;
        }
    }

    /** @param {string} routeId  */
    getRoute(routeId) {
        return this.#routes.find((route) => route.id === routeId);
    }

    /** @param {boolean} [keepHistory] */
    #findCurrentRouteAndNavigate(keepHistory) {
        const currentRoute = this.#routes.find((route) => route.path === window.location.pathname);

        if (!currentRoute) {
            this.navigate(appRouterIds.home);
            return;
        }

        this.navigate(currentRoute.id, keepHistory);
    }
}