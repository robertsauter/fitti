import '/models/Workout.js';
import '/models/Exercise.js';
import '/models/ExerciseResponse.js';
import { exercisesService } from '/services/ExercisesService.js';
import { EditExerciseCard } from '../components/EditExerciseCard.js';

export class WorkoutsAddPage extends HTMLElement {
    #ids = {
        exercisesList: 'exercisesList',
        addExerciseButton: 'addExerciseButton',
    }

    #inputNames = {
        name: 'name',
    }

    #exercisesAmount = 0

    constructor() {
        super();

        this.addExercise = this.addExercise.bind(this);

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <div class="page-container">
                <h2>Workout erstellen</h2>
                <form>
                    <label for="${this.#inputNames.name}">Workout Name</label>
                    <input id="${this.#inputNames.name}" name="${this.#inputNames.name}" />
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
            .addEventListener('click', this.addExercise);
    }

    addExercise() {
        const exercise = document.createElement('fit-edit-exercise-card');
        exercise.setAttribute('exerciseId', String(this.#exercisesAmount));

        this.shadowRoot
            .getElementById(this.#ids.exercisesList)
            .appendChild(exercise);

        this.#exercisesAmount += 1;
    }
}

customElements.define('fit-workouts-add-page', WorkoutsAddPage);