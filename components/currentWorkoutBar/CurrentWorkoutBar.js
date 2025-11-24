import { buttonSizeClassNames, iconNames } from '/Constants.js';
import { appRouterIds } from '/Routes.js';
import { workoutsStartStore } from '/store/WorkoutsStartStore.js';
import { SetTimer } from '/components/currentWorkoutBar/SetTimer.js';
import { WorkoutTimer } from '/components/currentWorkoutBar/WorkoutTimer.js';

export class CurrentWorkoutBar extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
                .timer {
                    background-color: var(--background-secondary);
                    border-radius: 0 0 1rem 1rem;
                    position: fixed;
                    width: 100%;
                }
                .innerTimer {
                    display: flex;
                    padding: 0.5rem 2rem;
                    align-items: center;
                    gap: 0.5rem;
                }
                .timerWrapper {
                    background-color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 9999px;
                    flex-grow: 1;
                }
            </style>
            <div class="timer">
                <div class="innerTimer">
                    <div class="emojiCircle">
                        <fit-app-router-link route="${appRouterIds.workoutsStart}" size="icon">
                            <fit-icon name="${iconNames.notepadEmoji}"></fit-icon>
                        </fit-app-router-link>
                    </div>
                    <div class="timerWrapper">
                        <fit-workout-timer></fit-workout-timer>
                    </div>
                    <div class="timerWrapper">
                        <fit-set-timer></fit-set-timer>
                    </div>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.shadowRoot
            ?.querySelector('fit-app-router-link')
            ?.setAttribute('data-id', String(workoutsStartStore.workoutId));
    }
}

customElements.define('fit-current-workout-bar', CurrentWorkoutBar);