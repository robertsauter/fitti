import { globalClassNames } from '/Constants.js';
import { appRouter } from '/Routes.js';
import { exercisesService } from '/services/ExercisesService.js';
import '/models/Exercise.js';
import { compareDate, formatDate, isSameDay } from '/lib/DateHelpers.js';

export class ExerciseHistoryPage extends HTMLElement {
    /** @type {string | null} */
    #exerciseId = null;

    constructor() {
        super();

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
                .setWrapper {
                    display: grid;
                    grid-template-columns: 1fr 1fr 2fr;
                }
                .dayList {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .dayCard {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
            </style>
            <div class="${globalClassNames.pageContainer}">
                <h1></h1>
                <p></p>
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
        this.shadowRoot.querySelector('h1').textContent = `Übungsfortschritt für ${exercise.Name}`;

        const exerciseHistory = await exercisesService.getExerciseHistory(this.#exerciseId);

        if (exerciseHistory === undefined) {
            this.#displayFallback();
            return;
        }

        const highestWeight = exerciseHistory.History.toSorted((firstEntry, secondEntry) => (secondEntry.Weight - firstEntry.Weight))[0].Weight;
        const bestSetEver = exerciseHistory.History
            .filter((entry) => (entry.Weight === highestWeight))
            .toSorted((firstEntry, secondEntry) => (secondEntry.Reps - firstEntry.Reps))[0];

        this.shadowRoot.querySelector('p').textContent = `Bester Satz: ${bestSetEver.Weight}kg x ${bestSetEver.Reps} Wiederholungen (${formatDate(bestSetEver.Date)})`;

        const historyByDay = exerciseHistory.History
            .reduce(this.groupHistoryEntriesByDate, [])
            .toSorted((firstGroup, secondGroup) => (compareDate(secondGroup[0].Date, firstGroup[0].Date)));

        const dayList = this.shadowRoot.querySelector('ul');
        dayList.className = 'dayList';
        historyByDay.forEach((day) => {
            dayList.appendChild(this.#createHistoryDay(day));
        });
    }

    /** 
     * @param {ExerciseHistoryEntry[][]} groupedEntries 
     * @param {ExerciseHistoryEntry} entry 
     * @returns {ExerciseHistoryEntry[][]}
     * */
    groupHistoryEntriesByDate(groupedEntries, entry) {
        if (groupedEntries.length === 0) {
            return [[entry]];
        }

        const lastEntryGroup = groupedEntries[groupedEntries.length - 1];
        if (isSameDay(lastEntryGroup[0].Date, entry.Date)) {
            const newLastEntryGroup = [...lastEntryGroup, entry];
            const groupedEntriesWithoutLast = groupedEntries.slice(0, -1);
            return [...groupedEntriesWithoutLast, newLastEntryGroup];
        }

        return [...groupedEntries, [entry]];
    }

    /** 
     * @param {ExerciseHistoryEntry[]} historyEntries 
     *  */
    #createHistoryDay(historyEntries) {
        const date = historyEntries[0].Date;
        const dayElement = document.createElement('li');
        dayElement.className = 'card secondary dayCard';

        const dateElement = document.createElement('h2');
        dateElement.textContent = formatDate(date);
        dayElement.appendChild(dateElement);

        const setsList = document.createElement('ul');
        setsList.className = 'card white';

        historyEntries.forEach((entry, index) => {
            const setElement = document.createElement('li');
            setElement.className = 'setWrapper';

            const setIndexElement = document.createElement('p');
            setIndexElement.textContent = `${index + 1}. Satz:`;
            setElement.appendChild(setIndexElement);

            const weightElement = document.createElement('p');
            weightElement.textContent = `${entry.Weight}kg`;
            setElement.appendChild(weightElement);

            const repsElement = document.createElement('p');
            repsElement.textContent = `${entry.Reps} Wiederholungen`;
            setElement.appendChild(repsElement);

            setsList.appendChild(setElement);
        });

        dayElement.appendChild(setsList);

        return dayElement;
    }

    #displayFallback() {
        const fallbackElement = document.createElement('p');
        fallbackElement.textContent = 'Du hast noch keinen Fortschritt für diese Übung aufgezeichnet.';
        this.shadowRoot.querySelector(`.${globalClassNames.pageContainer}`).appendChild(fallbackElement);
    }
}

customElements.define('fit-exercise-history-page', ExerciseHistoryPage);