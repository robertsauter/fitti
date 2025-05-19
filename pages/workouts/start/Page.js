import { appRouter } from '/Routes.js';
import { workoutsService } from '/services/WorkoutsService.js';
import '/models/Workout.js';
import { StartExerciseCard } from '/pages/workouts/components/StartExerciseCard.js';

export class WorkoutsStartPage extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <div class="page-container">
                <h2></h2>
                <ul></ul>
            </div>
        `;
    }

    async connectedCallback() {
        const id = appRouter.getParamValue('id');

        if (id === null) {
            this.#displayFallback();
            return;
        }

        const workout = await workoutsService.getUserWorkout(Number(id));

        if (workout === undefined) {
            this.#displayFallback();
            return;
        }

        this.shadowRoot.querySelector('h2').textContent = workout.Name;
        this.#displayExercises(workout);
    }

    #displayFallback() {
        this.shadowRoot.querySelector('.page-container').innerHTML = `<p>Workout konnte nicht gefunden werden.</p>`;
    }

    /** @param {Workout} workout  */
    #displayExercises(workout) {
        const wrapperElement = this.shadowRoot.querySelector('ul');

        workout.Exercises.forEach((exercise) => {
            const exerciseElement = document.createElement('fit-start-exercise-card');

            if (!(exerciseElement instanceof StartExerciseCard)) {
                return;
            }

            exerciseElement.workoutExercise = exercise;
            wrapperElement.appendChild(exerciseElement);
        });

        const addButton = document.createElement('button');
        addButton.textContent = 'Übung hinzufügen';
        wrapperElement.appendChild(addButton);
    }
}

customElements.define('fit-workouts-start-page', WorkoutsStartPage);