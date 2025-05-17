import { appRouter, appRouterIds } from '/Routes.js';
import { workoutsService } from '/services/WorkoutsService.js';

export class WorkoutsStartPage extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <div class="page-container">
                <h2>Workout machen</h2>
            </div>
        `;
    }
}

customElements.define('fit-workouts-start-page', WorkoutsStartPage);