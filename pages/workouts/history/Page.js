import { globalClassNames } from '/Constants.js';
import { workoutsService } from '/services/WorkoutsService.js';
import '/models/Workout.js';
import { exercisesService } from '/services/ExercisesService.js';

export class WorkoutsHistoryPage extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <div class="${globalClassNames.pageContainer}">
                <h2>Beendete Workouts</h2>
                <ul></ul>
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

        const workoutsList = this.shadowRoot.querySelector('ul');

        workoutHistory.forEach(async (workout) => {
            const workoutElement = await this.#createWorkoutElement(workout);
            workoutsList.appendChild(workoutElement);
        });
    }

    /** @param {WorkoutHistoryEntry} workoutHistoryEntry  */
    async #createWorkoutElement(workoutHistoryEntry) {
        const workout = await workoutsService.getUserWorkout(workoutHistoryEntry.WorkoutId);

        const workoutElement = document.createElement('li');

        const workoutTitle = document.createElement('h3');
        workoutTitle.textContent = workout.Name;
        workoutElement.appendChild(workoutTitle);

        const workoutDate = document.createElement('p');
        workoutDate.textContent = `${workoutHistoryEntry.Date.getDate()}.${workoutHistoryEntry.Date.getMonth()}.${workoutHistoryEntry.Date.getFullYear()}`;
        workoutElement.appendChild(workoutDate);

        const exercisesList = document.createElement('ul');
        await Promise.all(workoutHistoryEntry.Exercises.map(async (exercise) => {
            const exerciseElement = await this.#createExerciseElement(exercise);
            exercisesList.appendChild(exerciseElement);
        }));
        workoutElement.appendChild(exercisesList);

        return workoutElement;
    }

    /** @param {WorkoutStartExerxise} exercise */
    async #createExerciseElement(exercise) {
        const exerciseDetails = await exercisesService.getUserOrGlobalExercise(exercise.id);

        const exerciseElement = document.createElement('li');

        const exerciseName = document.createElement('p');
        exerciseName.textContent = exerciseDetails.Name;
        exerciseElement.appendChild(exerciseName);

        const setsList = document.createElement('ol');
        await Promise.all(exercise.sets.map((set) => {
            const setElement = this.#createSetElement(set);
            setsList.appendChild(setElement);
        }));
        exerciseElement.appendChild(setsList);

        return exerciseElement;
    }

    /** @param {WorkoutStartSet} set  */
    #createSetElement(set) {
        const setElement = document.createElement('li');

        const weight = document.createElement('p');
        weight.textContent = `Weight: ${set.weight}`;
        setElement.appendChild(weight);

        const reps = document.createElement('p');
        reps.textContent = `Reps: ${set.reps}`;
        setElement.appendChild(reps);

        return setElement;
    }

    #displayFallback() {
        this.shadowRoot.querySelector(`.${globalClassNames.pageContainer}`).innerHTML = `<p>Keine Workouts gefunden.</p>`;
    }
}

customElements.define('fit-workouts-history-page', WorkoutsHistoryPage);