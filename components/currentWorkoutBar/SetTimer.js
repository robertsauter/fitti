import { globalClassNames, iconNames } from '/Constants.js';
import { getTimeDifferenceFromNow } from '/lib/DateHelpers.js';
import { workoutsStartStore } from '/store/WorkoutsStartStore.js';

export class SetTimer extends HTMLElement {
    /** @type {number | null} */
    #intervalId = null;

    constructor() {
        super();

        this.startTimer = this.startTimer.bind(this);

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
                .setTitle {
                    font-weight: bold;
                }
                .timerWrapper {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
            </style>
            <div class="timerWrapper">
                <button class="button icon" type="button">
                    <fit-icon name="${iconNames.timerFilled}"></fit-icon>
                </button>
                <div>
                    <p class="setTitle">Set:</p>
                    <p class="timerClock">00:00:00</p>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.#updateTimer();

        this.shadowRoot
            ?.querySelector('button')
            ?.addEventListener('click', this.startTimer);

        this.#intervalId = setInterval(() => {
            this.#updateTimer();
        }, 1000);
    }

    disconnectedCallback() {
        if (this.#intervalId === null) {
            return;
        }

        clearInterval(this.#intervalId);
        this.#intervalId = null;
    }

    startTimer() {
        workoutsStartStore.resetSetTimerStartDate();
    }

    #updateTimer() {
        const timerElement = this.shadowRoot?.querySelector('.timerClock');

        if (!timerElement || workoutsStartStore.setTimerStartDate === null) {
            return;
        }

        timerElement.textContent = getTimeDifferenceFromNow(workoutsStartStore.setTimerStartDate);
    }
}

customElements.define('fit-set-timer', SetTimer);