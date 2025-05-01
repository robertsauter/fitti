import '/models/Workout.js';
import '/models/Exercise.js';
import '/models/ExerciseResponse.js';
import { exercisesService } from '/services/ExercisesService.js';

export class WorkoutsAddPage extends HTMLElement {
    #ids = {
        exercisesList: 'exercisesList',
        addExerciseButton: 'addExerciseButton',
        exerciseWrapper: 'exerciseWrapper',
        upButton: 'upButton',
        downButton: 'downButton',
        deleteButton: 'deleteButton',
    }

    #inputNames = {
        name: 'name',
        exercise: 'exercise',
        sets: 'sets',
    }

    #exercisesAmount = 0

    /** @type {ExerciseResponse[]} */
    #globalExercises = []
    /** @type {Exercise[]} */
    #userExercises = []

    constructor() {
        super();

        this.addExercise = this.addExercise.bind(this);
        this.deleteExercise = this.deleteExercise.bind(this);

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

        this.#globalExercises = await exercisesService.getGlobalExercises();
        this.#userExercises = await exercisesService.getUserExercises();
    }

    addExercise() {
        const exerciseWrapper = document.createElement('li');
        exerciseWrapper.id = `${this.#ids.exerciseWrapper}${this.#exercisesAmount}`;

        const upButtonId = `${this.#ids.upButton}${this.#exercisesAmount}`;
        const downButtonId = `${this.#ids.downButton}${this.#exercisesAmount}`;
        const deleteButtonId = `${this.#ids.deleteButton}${this.#exercisesAmount}`;
        const selectName = `${this.#inputNames.exercise}${this.#exercisesAmount}`;
        const inputName = `${this.#inputNames.sets}${this.#exercisesAmount}`;

        exerciseWrapper.innerHTML = `
            <button id="${upButtonId}" type="button">oben</button>
            <button id="${downButtonId}" type="button">unten</button>
            <button id="${deleteButtonId}" type="button">entfernen</button>
            <label for="${selectName}">Übung</label>
            <select id="${selectName}" name="${selectName}">
                ${this.#globalExercises.length > 0 && `
                    <optgroup label="Ausgewählte Übungen">
                        ${this.#globalExercises.map((exercise) => `
                            <option value="${exercise.ID}">${exercise.Name}</option>
                        `)}
                    </optgroup>    
                `}
                ${this.#userExercises.length > 0 && `
                    <optgroup label="Deine Übungen">
                        ${this.#userExercises.map((exercise) => `
                            <option value="${exercise.ID}">${exercise.Name}</option>
                        `)}
                    </optgroup>
                `}
            </select>
            <label for="${inputName}">Sets</label>
            <input id="${inputName}" name="${inputName}" />
        `;

        this.shadowRoot
            .getElementById(this.#ids.exercisesList)
            .appendChild(exerciseWrapper);

        const currentIndex = this.#exercisesAmount;
        this.shadowRoot
            .getElementById(deleteButtonId)
            .addEventListener('click', () => this.deleteExercise(currentIndex));

        this.#exercisesAmount += 1;
    }

    /** @param {number} index  */
    deleteExercise(index) {
        this.shadowRoot
            .getElementById(`${this.#ids.exerciseWrapper}${index}`)
            .remove();
    }
}

customElements.define('fit-workouts-add-page', WorkoutsAddPage);