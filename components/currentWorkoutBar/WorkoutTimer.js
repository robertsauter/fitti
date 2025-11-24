import { globalClassNames } from '/Constants.js';
import { getTimeDifferenceFromNow } from '/lib/DateHelpers.js';
import { workoutsStartStore } from '/store/WorkoutsStartStore.js';

export class WorkoutTimer extends HTMLElement {
    /** @type {number | null} */
    #intervalId = null;

    constructor() {
        super();

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
                .timerTitle {
                    font-weight: bold;
                }
            </style>
            <p class="timerTitle">Gesamt:</p>
            <p class="timerClock"></p>
        `;
    }

    connectedCallback() {
        this.updateTimer();

        this.#intervalId = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }

    disconnectedCallback() {
        if (this.#intervalId === null) {
            return;
        }

        clearInterval(this.#intervalId);
        this.#intervalId = null;
    }

    updateTimer() {
        const timerElement = this.shadowRoot?.querySelector('.timerClock');

        if (!timerElement || workoutsStartStore.startDate === null) {
            return;
        }

        timerElement.textContent = getTimeDifferenceFromNow(workoutsStartStore.startDate);
    }
}

customElements.define('fit-workout-timer', WorkoutTimer);