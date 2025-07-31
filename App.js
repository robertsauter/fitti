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
        try {
            window.screen.orientation
                .lock('portrait-primary');
        } catch (error) {
            console.error(error);
        }

        await promiseIndexedDB.initialize();
        exercisesService.syncGlobalExercises();

        appRouter.outlet = this;

        const appContainer = this.shadowRoot?.querySelector('.appContainer');
        if (!appContainer) {
            return;
        }

        const navTabs = new NavTabs();
        appContainer.appendChild(navTabs);
    }
}

customElements.define('fit-app', App);