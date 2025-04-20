import { appRouter, appRouterIds } from '../Routes.js';
import { Link } from './Link.js';

export class NavTabs extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                .tabs-wrapper {
                    display: flex;
                    justify-content: space-around;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: calc(100% - 4rem);
                    padding: 2rem;
                    background-color: white;
                }
            </style> 
            <div class="tabs-wrapper">
                <fit-link route="${appRouterIds.home}">Home</fit-link>
                <fit-link route="${appRouterIds.plans}">Traininspläne</fit-link>
                <fit-link route="${appRouterIds.workouts}">Workouts</fit-link>
                <fit-link route="${appRouterIds.exercises}">Übungen</fit-link>
            </div>
        `;
    }

    connectedCallback() {
        /** @type {NodeListOf<Link>} */
        const links = this.shadowRoot.querySelectorAll('fit-link');
        links.forEach((link) => link.router = appRouter);
    }
}

customElements.define('fit-nav-tabs', NavTabs);