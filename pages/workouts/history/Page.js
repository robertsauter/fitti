import { globalClassNames, iconNames } from '/Constants.js';
import { workoutsService } from '/services/WorkoutsService.js';
import '/models/Workout.js';
import { exercisesService } from '/services/ExercisesService.js';
import { compareDate, formatDate } from '/lib/DateHelpers.js';
import { RandomGenderWorkoutEmoji } from '/components/RandomGenderWorkoutEmoji.js';
import { Icon } from '/components/Icon.js';

export class WorkoutsHistoryPage extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
                .workoutsList {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .exercisesList {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .card {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .setWrapper {
                    display: grid;
                    grid-template-columns: 1fr 1.5fr 1.5fr;
                } 
            </style>
            <div class="${globalClassNames.pageContainer}">
                <div class="${globalClassNames.titleWrapper}">
                    <div class="${globalClassNames.emojiCircle}">
                        <fit-random-gender-workout-emoji></fit-random-gender-workout-emoji>
                        <fit-icon name="${iconNames.checkmarkEmoji}"></fit-icon>
                    </div>
                    <h1>Beendete Workouts</h1>
                </div>
                <ul class="workoutsList"></ul>
            </div>
        `;

        this.#displayWorkouts();
    }

    async #displayWorkouts() {
        const workoutHistory = await workoutsService.getWorkoutHistory();
        if (workoutHistory === undefined || workoutHistory.length === 0) {
            this.#displayFallback();
            return;
        }

        const workoutsList = this.shadowRoot?.querySelector('ul');

        if (!workoutsList) {
            return;
        }

        workoutHistory.sort((firstWorkout, secondWorkout) => compareDate(secondWorkout.Date, firstWorkout.Date));

        workoutHistory.forEach(async (workout) => {
            const workoutElement = await this.#createWorkoutElement(workout);

            if (workoutElement === null) {
                return;
            }

            workoutsList.appendChild(workoutElement);
        });
    }

    /** @param {WorkoutHistoryEntry} workoutHistoryEntry  */
    async #createWorkoutElement(workoutHistoryEntry) {
        const workout = await workoutsService.getUserWorkout(workoutHistoryEntry.WorkoutId);

        if (workout === undefined) {
            return null;
        }

        const workoutElement = document.createElement('li');
        workoutElement.className = 'card';

        const workoutTitle = document.createElement('h2');
        workoutTitle.textContent = workout.Name;
        workoutElement.appendChild(workoutTitle);

        const workoutDate = document.createElement('p');
        workoutDate.textContent = formatDate(workoutHistoryEntry.Date);
        workoutElement.appendChild(workoutDate);

        const exercisesList = document.createElement('ul');
        exercisesList.className = 'exercisesList';
        await Promise.all(workoutHistoryEntry.Exercises.map(async (exercise) => {
            const exerciseElement = await this.#createExerciseElement(exercise);

            if (exerciseElement === null) {
                return;
            }

            exercisesList.appendChild(exerciseElement);
        }));
        workoutElement.appendChild(exercisesList);

        return workoutElement;
    }

    /** @param {WorkoutStartExercise} exercise */
    async #createExerciseElement(exercise) {
        const exerciseDetails = await exercisesService.getUserExercise(exercise.id);

        if (exerciseDetails === undefined) {
            return null;
        }

        const exerciseElement = document.createElement('li');
        const exerciseName = document.createElement('h3');
        exerciseName.textContent = exerciseDetails.Name;
        exerciseElement.appendChild(exerciseName);

        const setsList = document.createElement('ul');
        await Promise.all(exercise.sets.map((set, index) => {
            const setElement = this.#createSetElement(set, index);
            setsList.appendChild(setElement);
        }));
        exerciseElement.appendChild(setsList);

        return exerciseElement;
    }

    /** 
     * @param {WorkoutStartSet} set 
     * @param {number} index 
     *  */
    #createSetElement(set, index) {
        const setElement = document.createElement('li');
        setElement.className = 'setWrapper';

        const setIndex = document.createElement('p');
        setIndex.textContent = `${index + 1}. Satz:`;
        setElement.appendChild(setIndex);

        const weight = document.createElement('p');
        weight.textContent = `Gewicht: ${set.weight}`;
        setElement.appendChild(weight);

        const reps = document.createElement('p');
        reps.textContent = `Reps: ${set.reps}`;
        setElement.appendChild(reps);

        return setElement;
    }

    #displayFallback() {
        const pageContainer = this.shadowRoot?.querySelector(`.${globalClassNames.pageContainer}`);

        if (!pageContainer) {
            return;
        }

        pageContainer.innerHTML = `<p>Keine Workouts gefunden.</p>`;
    }
}

customElements.define('fit-workouts-history-page', WorkoutsHistoryPage);