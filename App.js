import { appRouter, appRouterIds } from '/Routes.js';
import { NavTabs } from '/components/NavTabs.js';
import { exercisesService } from '/services/ExercisesService.js';
import { promiseIndexedDB } from '/lib/PromiseIndexedDB.js';
import { indexedDBManager } from '/lib/IndexedDBManager.js';
import { workoutsStartStore } from '/store/WorkoutsStartStore.js';
import { CurrentWorkoutBar } from '/components/currentWorkoutBar/CurrentWorkoutBar.js';
import { styleSheetManager } from '/lib/StyleSheetManager.js';

export class App extends HTMLElement {
    constructor() {
        super();

        this.toggleCurrentWorkoutBar = this.toggleCurrentWorkoutBar.bind(this);

        styleSheetManager.initialize();

        document.adoptedStyleSheets = [styleSheetManager.sheet];

        const componentStyleSheet = new CSSStyleSheet();
        componentStyleSheet.replaceSync(`
            #routerOutlet.currentWorkoutBarShown {
                padding-top: 4rem;
            }
        `);

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [styleSheetManager.sheet, componentStyleSheet];

        shadow.innerHTML = `
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
        indexedDBManager.runMigrations();

        appRouter.outlet = this;

        const appContainer = this.shadowRoot?.querySelector('.appContainer');
        if (!appContainer) {
            return;
        }

        const navTabs = new NavTabs();
        appContainer.appendChild(navTabs);

        workoutsStartStore.addIsStartedObserver(this.toggleCurrentWorkoutBar);
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

    /** @param {boolean} isStarted  */
    toggleCurrentWorkoutBar(isStarted) {
        const appContainer = this.shadowRoot?.querySelector('.appContainer');
        const routerOutlet = this.shadowRoot?.getElementById('routerOutlet');

        if (!appContainer || !routerOutlet) {
            return;
        }

        if (!isStarted) {
            const workoutBar = this.shadowRoot?.querySelector('fit-current-workout-bar');

            if (!workoutBar) {
                return;
            }

            workoutBar.remove();
            routerOutlet.classList.remove('currentWorkoutBarShown');

            return;
        }

        const workoutBar = new CurrentWorkoutBar();
        appContainer.insertBefore(workoutBar, routerOutlet);
        routerOutlet.classList.add('currentWorkoutBarShown');
    }
}

customElements.define('fit-app', App);