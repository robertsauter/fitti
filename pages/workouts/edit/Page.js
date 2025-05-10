import '/models/Workout.js';
import '/models/Exercise.js';
import '/models/ExerciseResponse.js';
import { EditExerciseCard } from '/pages/workouts/components/EditExerciseCard.js';
import { workoutsService } from '/services/WorkoutsService.js';
import { appRouter, appRouterIds } from '/Routes.js';

export class WorkoutsEditPage extends HTMLElement {
    #ids = {
        exercisesList: 'exercisesList',
        addExerciseButton: 'addExerciseButton',
        workoutForm: 'workoutForm',
    };

    #inputNames = {
        name: 'name',
    };

    #exercisesAmount = 0;

    /** @type {number | null} */
    #workoutId = null;

    constructor() {
        super();

        this.saveWorkout = this.saveWorkout.bind(this);

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <div class="page-container">
                <h2>Workout bearbeiten</h2>
                <form id="${this.#ids.workoutForm}">
                    <label for="${this.#inputNames.name}">Workout Name</label>
                    <input id="${this.#inputNames.name}" name="${this.#inputNames.name}" required />
                    <ul id="${this.#ids.exercisesList}"></ul>
                    <button id="${this.#ids.addExerciseButton}" type="button">Übung hinzufügen</button>
                    <button type="submit">Speichern</button>
                </form>
            </div>
        `;
    }

    async connectedCallback() {
        this.shadowRoot
            .getElementById(this.#ids.addExerciseButton)
            .addEventListener('click', () => this.addExercise());

        this.shadowRoot
            .getElementById(this.#ids.workoutForm)
            .addEventListener('submit', this.saveWorkout);

        const id = appRouter.getParamValue('id');

        if (id !== null) {
            this.#workoutId = Number(id);
            this.#initializeWorkout();
        }
    }

    async #initializeWorkout() {
        const workout = await workoutsService.getUserWorkout(this.#workoutId);

        const nameInput = this.shadowRoot.getElementById(this.#inputNames.name);

        if (nameInput instanceof HTMLInputElement) {
            nameInput.value = workout.Name;
        }

        workout.Exercises.forEach((exercise) => {
            this.addExercise(exercise);
        });
    }

    /** @param {WorkoutExercise} [exercise]  */
    addExercise(exercise) {
        const exerciseElement = document.createElement('fit-edit-exercise-card');

        if (!(exerciseElement instanceof EditExerciseCard)) {
            return;
        }

        exerciseElement.setAttribute('exerciseId', String(this.#exercisesAmount));

        if (exercise !== undefined) {
            exerciseElement.selectedExerciseId = exercise.ID;
            exerciseElement.setsAmount = String(exercise.Sets);
        }

        this.shadowRoot
            .getElementById(this.#ids.exercisesList)
            .appendChild(exerciseElement);

        this.#exercisesAmount += 1;
    }

    /** @param {SubmitEvent} event  */
    async saveWorkout(event) {
        event.preventDefault();

        if (!(event.currentTarget instanceof HTMLFormElement)) {
            return;
        }

        const formData = new FormData(event.currentTarget);
        const workoutName = formData.get(this.#inputNames.name);

        if (typeof workoutName !== 'string') {
            return;
        }

        /** @type {WorkoutExercise[]} */
        const exercises = [];
        this.shadowRoot
            .querySelectorAll('fit-edit-exercise-card')
            .forEach((card) => {
                if (!(card instanceof EditExerciseCard)) {
                    return;
                }

                exercises.push({
                    ID: card.selectedExerciseId,
                    Sets: Number(card.setsAmount)
                });
            });

        if (exercises.length < 1) {
            return;
        }

        if (this.#workoutId === null) {
            await workoutsService.addUserWorkout({
                Name: workoutName,
                Exercises: exercises,
            });
        } else {
            await workoutsService.putUserWorkout({
                ID: this.#workoutId,
                Name: workoutName,
                Exercises: exercises,
            });
        }

        appRouter.navigate(appRouterIds.workouts);
    }
}

customElements.define('fit-workouts-edit-page', WorkoutsEditPage);