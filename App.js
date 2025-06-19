import { appRouter, appRouterIds } from '/Routes.js';
import { NavTabs } from '/components/NavTabs.js';
import { exercisesService } from '/services/ExercisesService.js';
import { promiseIndexedDB } from '/lib/PromiseIndexedDB.js';

export class App extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                .app-container {
                    height: 100vh;
                    overflow: scroll;
                }
            </style>

            <div class="app-container">
                <div id="router-outlet"></div>

                <fit-nav-tabs></fit-nav-tabs>
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
    }
}

customElements.define('fit-app', App);