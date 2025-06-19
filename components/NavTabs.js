import { appRouter, appRouterIds } from '/Routes.js';
import { AppRouterLink } from '/components/AppRouterLink.js';

export class NavTabs extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
                .tabs-wrapper {
                    display: flex;
                    justify-content: space-around;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: calc(100% - 6rem);
                    padding: 1rem;
                    background-color: var(--pink);
                    border-radius: 9999px;
                    margin: 0.5rem 2rem;
                }
            </style> 
            <div class="tabs-wrapper">
                <fit-app-router-link route="${appRouterIds.workouts}">Workouts</fit-app-router-link>
                <fit-app-router-link route="${appRouterIds.exercises}">Übungen</fit-app-router-link>
            </div>
        `;
    }
}

customElements.define('fit-nav-tabs', NavTabs);