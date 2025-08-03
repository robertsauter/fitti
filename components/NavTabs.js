import { iconNames } from '/Constants.js';
import { appRouter, appRouterIds } from '/Routes.js';
import { AppRouterLink } from '/components/AppRouterLink.js';
import { Icon } from '/components/Icon.js';
import { RandomGenderWorkoutEmoji } from '/components/RandomGenderWorkoutEmoji.js';

export class NavTabs extends HTMLElement {

    constructor() {
        super();

        this.updateTabs = this.updateTabs.bind(this);

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
                .navbarContainer {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    background-color: var(--pink);
                    border-top-left-radius: 1rem;
                    border-top-right-radius: 1rem;
                    margin-top: 0.5rem;
                }
                .tabsWrapper {
                    padding: 1rem;
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 0.25rem;
                }
                fit-app-router-link::part(link) {
                    display: flex;
                    align-items: center;
                    font-weight: bold;
                    gap: 0.5rem;
                    font-size: 1.125rem;
                    background-color: white;
                    padding: 1rem;
                    justify-content: center;
                    color: inherit;
                }
                .tab.active fit-app-router-link::part(link) {
                    background-color: var(--primary);
                    color: white;
                }
                .tab.middle fit-app-router-link::part(link) {
                    border-radius: 0.25rem;
                }
                .tab.left fit-app-router-link::part(link) {
                    border-top-left-radius: 2rem;
                    border-bottom-left-radius: 2rem;
                    border-top-right-radius: 0.25rem;
                    border-bottom-right-radius: 0.25rem;
                }
                .tab.right fit-app-router-link::part(link) {
                    border-top-right-radius: 2rem;
                    border-bottom-right-radius: 2rem;
                    border-top-left-radius: 0.25rem;
                    border-bottom-left-radius: 0.25rem;
                }
            </style>
            <div class="navbarContainer">
                <div class="tabsWrapper">
                    <div class="tab left">
                        <fit-app-router-link route="${appRouterIds.workouts}">
                            <fit-random-gender-workout-emoji></fit-random-gender-workout-emoji>
                        </fit-app-router-link>
                    </div>
                    <div class="tab middle">
                        <fit-app-router-link route="${appRouterIds.exercises}">
                            <fit-icon name="${iconNames.bicepEmoji}"></fit-icon>
                        </fit-app-router-link>
                    </div>
                    <div class="tab right">
                        <fit-app-router-link route="${appRouterIds.settings}">
                            <fit-icon name="${iconNames.gearEmoji}"></fit-icon>
                        </fit-app-router-link>
                    </div>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        appRouter.addActiveRouteObserver((activeRoute) => {
            if (activeRoute === undefined) {
                return;
            }

            if (activeRoute.path.includes('workouts')) {
                this.updateTabs('left');
            } else if (activeRoute.path.includes('uebungen')) {
                this.updateTabs('middle');
            } else if (activeRoute.path.includes('einstellungen')) {
                this.updateTabs('right');
            }
        });
    }

    /** @param {string} className  */
    updateTabs(className) {
        const tabs = this.shadowRoot?.querySelectorAll('.tab');

        if (tabs === undefined) {
            return;
        }

        tabs.forEach((tab) => {
            if (tab.classList.contains(className)) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }
}

customElements.define('fit-nav-tabs', NavTabs);