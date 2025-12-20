import { appRouterIds } from '/Routes.js';
import { Observable } from '/lib/Observable.js';
import '/models/Route.js';
import '/models/Observer.js';

export class ClientRouter {

    /** @type {Route[]} */
    #routes;

    /** @type {HTMLElement | undefined} */
    #outlet;

    /** @type {Route | undefined} */
    #activeRoute;

    /** @type {Observable<Route | undefined>} */
    #activeRouteObservable = new Observable();

    /** @param {Route[]} routes */
    constructor(routes) {
        this.#routes = routes;

        this.addActiveRouteObserver = this.addActiveRouteObserver.bind(this);
    }

    get activeRoute() {
        return this.#activeRoute;
    }

    /** @param {HTMLElement} outletParent  */
    set outlet(outletParent) {
        const outlet = outletParent.shadowRoot?.getElementById('routerOutlet');

        if (!outlet) {
            return;
        }

        this.#outlet = outlet;

        this.#findCurrentRouteAndNavigate(true);

        window.addEventListener('popstate', () => {
            this.#findCurrentRouteAndNavigate(true);
        });
    }

    /** @param {Observer<Route | undefined>} observer  */
    addActiveRouteObserver(observer) {
        this.#activeRouteObservable.addObserver(observer);
    }

    /**
     * @param {string} routeId 
     * @param {boolean} [keepHistory]
     * @param {Map<string, string>} [params]
     * */
    async navigate(routeId, keepHistory, params) {
        const foundRoute = this.#routes.find((route) => route.id === routeId);

        if (!foundRoute || this.#outlet === undefined) {
            console.error(`Route ID not found in registered routes: "${routeId}"`);
            return;
        }

        if (this.#activeRoute && foundRoute.id === this.#activeRoute.id && params === undefined) {
            return;
        }

        this.#activeRoute = foundRoute;

        if (!keepHistory) {
            let path = foundRoute.path;

            if (params) {
                params.forEach((value, key) => {
                    const keyParam = `:${key}`;

                    if (path.includes(keyParam)) {
                        path = path.replace(keyParam, value);
                    }
                });
            }

            window.history.pushState({}, '', path);
        }

        await import(foundRoute.importPath);
        this.#outlet.innerHTML = foundRoute.component;

        this.#activeRouteObservable.emit(this.#activeRoute);
    }

    /** @param {string} routeId  */
    getRoute(routeId) {
        return this.#routes.find((route) => route.id === routeId);
    }

    /** 
     * @param {string} param 
     * @return {string | null}
     */
    getParamValue(param) {
        const routeParts = this.#activeRoute?.path.split('/');
        const locationParts = window.location.pathname.split('/');
        const index = routeParts?.findIndex((part) => part === `:${param}`);

        if (index === -1 || index === undefined) {
            return null;
        }

        return locationParts[index];
    }

    /** @param {Route} route */
    #getAllParamValues(route) {
        const routeParts = route.path.split('/');
        const locationParts = window.location.pathname.split('/');

        if (routeParts.length !== locationParts.length || !route.path.includes(':')) {
            return undefined;
        }

        /** @type {Map<string, string>} */
        const paramValues = new Map();
        routeParts.forEach((routePart, index) => {
            if (!routePart.includes(':')) {
                return;
            }

            const paramName = routePart.split(':')[1];
            const paramValue = locationParts[index];

            paramValues.set(paramName, paramValue);
        });

        return paramValues;
    }

    /** @param {boolean} [keepHistory] */
    #findCurrentRouteAndNavigate(keepHistory) {
        const currentRoute = this.#routes.find((route) => {
            const routeParts = route.path.split('/');
            const locationParts = window.location.pathname.split('/');

            if (routeParts.length !== locationParts.length) {
                return false;
            }

            const areRoutePartsIncluded = locationParts.every(
                (part, index) => routeParts[index] === part || routeParts[index].includes(':')
            );

            return areRoutePartsIncluded;
        });

        if (!currentRoute) {
            this.navigate(appRouterIds.workouts);
            return;
        }

        const paramValues = this.#getAllParamValues(currentRoute);
        this.navigate(currentRoute.id, keepHistory, paramValues);
    }
}