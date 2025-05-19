import '/models/Workout.js';
import { exercisesService } from '/services/ExercisesService.js';
import '/models/Exercise.js';
import '/models/ExerciseResponse.js';

export class StartExerciseCard extends HTMLElement {
    /** @type {WorkoutExercise | null} */
    #workoutExercise = null;


    /** @param {WorkoutExercise} exercise */
    set workoutExercise(exercise) {
        this.#workoutExercise = exercise;
    }

    constructor() {
        super();

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <li></li>
        `;
    }

    connectedCallback() {
        this.#displayExercise(this.#workoutExercise);
    }

    /** @param {WorkoutExercise} workoutExercise */
    async #displayExercise(workoutExercise) {
        const idAsNumber = Number(workoutExercise.ID);
        /** @type {ExerciseResponse | Exercise} */
        let exercise;
        if (Number.isNaN(idAsNumber)) {
            const globalExercises = await exercisesService.getGlobalExercises();
            exercise = globalExercises.find((globalExercise) => globalExercise.ID === workoutExercise.ID);
        } else {
            exercise = await exercisesService.getUserExercise(idAsNumber);
        }

        const wrapperElement = this.shadowRoot.querySelector('li');

        const titleElement = document.createElement('h3');
        titleElement.textContent = exercise.Name;
        wrapperElement.appendChild(titleElement);

        wrapperElement.innerHTML += `
            <button>Oben</button>
            <button>Unten</button>
            <button>Löschen</button>
            ${Array.from(Array(workoutExercise.Sets)).map((_set, index) => `<div>
                <p>Set ${index + 1}</p>
                <label for="kg">KG</label>
                <input name="kg" id="kg" type="number" min="1" />
                <label for="reps">Wiederholungen</label>
                <input name="reps" id="reps" type="number" min="1" />
            </div>`).join('')}
            <button>Set hinzufügen</button>
        `;
    }
}

customElements.define('fit-start-exercise-card', StartExerciseCard);