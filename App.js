import { appRouter, appRouterIds } from '/Routes.js';
import { NavTabs } from '/components/NavTabs.js';
import { exercisesService } from '/services/ExercisesService.js';
import { promiseIndexedDB } from '/lib/PromiseIndexedDB.js';

export class App extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <div class="appContainer">
                <div id="routerOutlet"></div>
            </div> 
        `;
    }

    async connectedCallback() {
        this.requestPersistentStorage();
        this.registerServiceWorker();

        try {
            window.screen.orientation
                .lock('portrait-primary');
        } catch (error) {
            console.error(error);
        }

        await promiseIndexedDB.initialize();

        appRouter.outlet = this;

        const appContainer = this.shadowRoot?.querySelector('.appContainer');
        if (!appContainer) {
            return;
        }

        const navTabs = new NavTabs();
        appContainer.appendChild(navTabs);
    }

    async requestPersistentStorage() {
        if ('storage' in navigator) {
            const isPersisted = await navigator.storage.persisted();

            if (!isPersisted) {
                navigator.storage.persist();
            }
        }
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                navigator.serviceWorker.register('/sw.js');
            }
            catch (error) {
                console.error('Service worker registration failed');
            }
        }
    }
}

customElements.define('fit-app', App);