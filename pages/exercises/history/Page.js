import { globalClassNames } from '/Constants.js';
import { appRouter } from '/Routes.js';
import { exercisesService } from '/services/ExercisesService.js';

export class ExerciseHistoryPage extends HTMLElement {
    /** @type {string | null} */
    #exerciseId = null;

    constructor() {
        super();

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <div class="${globalClassNames.pageContainer}">
                <h2></h2>
                <ul></ul>
            </div>
        `;
    }

    connectedCallback() {
        const id = appRouter.getParamValue('id');

        if (id !== null) {
            this.#exerciseId = id;
            this.#createExerciseHistory();
        }
    }

    async #createExerciseHistory() {
        const exercise = await exercisesService.getUserOrGlobalExercise(this.#exerciseId);
        this.shadowRoot.querySelector('h2').textContent = `Übungsfortschritt für ${exercise.Name}`;

        const exerciseHistory = await exercisesService.getExerciseHistory(this.#exerciseId);

        if (exerciseHistory === undefined) {
            this.#displayFallback();
            return;
        }

        const setList = this.shadowRoot.querySelector('ul');

        exerciseHistory.History.forEach((historyEntry) => {
            const entryElement = document.createElement('li');

            const dateElement = document.createElement('p');
            dateElement.textContent = `${historyEntry.Date.getDate()}.${historyEntry.Date.getMonth()}.${historyEntry.Date.getFullYear()}`;
            entryElement.appendChild(dateElement);

            const weightElement = document.createElement('p');
            weightElement.textContent = `Gewicht: ${historyEntry.Weight}`;
            entryElement.appendChild(weightElement);

            const repsElement = document.createElement('p');
            repsElement.textContent = `Wiederholungen: ${historyEntry.Reps}`;
            entryElement.appendChild(repsElement);

            setList.appendChild(entryElement);
        });
    }

    #displayFallback() {
        const fallbackElement = document.createElement('p');
        fallbackElement.textContent = 'Du hast noch keinen Fortschritt für diese Übung aufgezeichnet.';
        this.shadowRoot.querySelector(`.${globalClassNames.pageContainer}`).appendChild(fallbackElement);
    }
}

customElements.define('fit-exercise-history-page', ExerciseHistoryPage);