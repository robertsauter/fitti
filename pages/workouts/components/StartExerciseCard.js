import '/models/Workout.js';
import { exercisesService } from '/services/ExercisesService.js';
import '/models/Exercise.js';
import '/models/ExerciseResponse.js';
import { ExerciseSet } from '/pages/workouts/components/ExerciseSet.js';

export class StartExerciseCard extends HTMLElement {
    #ids = {
        deleteButton: 'deleteButton',
        addButton: 'addButton',
    };

    #setsAmount = 0;

    /** @type {WorkoutExercise | null} */
    #workoutExercise = null;


    /** @param {WorkoutExercise} exercise */
    set workoutExercise(exercise) {
        this.#workoutExercise = exercise;
    }

    constructor() {
        super();

        this.deleteExercise = this.deleteExercise.bind(this);
        this.addSet = this.addSet.bind(this);

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
        this.#setsAmount = workoutExercise.Sets;

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

        const deleteButtonId = `${this.#ids.deleteButton}${exercise.ID}`;
        const addButtonId = `${this.#ids.addButton}${exercise.ID}`;

        wrapperElement.innerHTML += `
            <button id="${deleteButtonId}">Löschen</button>
            <ul></ul>
            <button id="${addButtonId}">Set hinzufügen</button>
        `;

        const setsList = wrapperElement.querySelector('ul');
        Array.from(Array(workoutExercise.Sets)).forEach((_set, index) => {
            const set = new ExerciseSet(exercise.ID, index + 1);
            setsList.appendChild(set);
        });

        this.shadowRoot
            .getElementById(deleteButtonId)
            .addEventListener('click', this.deleteExercise);
    }

    deleteExercise() {
        this.remove();
    }

    addSet() {
        this.#setsAmount += 1;
        const setsWrapper = this.shadowRoot.querySelector('ul');
        setsWrapper.appendChild(new ExerciseSet(this.#workoutExercise.ID, this.#setsAmount));
    }
}

customElements.define('fit-start-exercise-card', StartExerciseCard);