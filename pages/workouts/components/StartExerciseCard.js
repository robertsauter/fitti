import '/models/Workout.js';
import { exercisesService } from '/services/ExercisesService.js';
import '/models/Exercise.js';
import '/models/ExerciseResponse.js';
import { ExerciseSet } from '/pages/workouts/components/ExerciseSet.js';
import { workoutsStartStore } from '/store/WorkoutsStartStore.js';

export class StartExerciseCard extends HTMLElement {
    #ids = {
        deleteButton: 'deleteButton',
        addButton: 'addButton',
    };

    /** @type {WorkoutStartExerxise | null} */
    #workoutExercise = null;


    /** @param {WorkoutStartExerxise} exercise */
    set workoutExercise(exercise) {
        this.#workoutExercise = exercise;
    }

    constructor() {
        super();

        this.deleteExercise = this.deleteExercise.bind(this);
        this.addSet = this.addSet.bind(this);
        this.updateSetsOnRemove = this.updateSetsOnRemove.bind(this);

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

    /** @param {WorkoutStartExerxise} workoutStartExercise */
    async #displayExercise(workoutStartExercise) {
        const idAsNumber = Number(workoutStartExercise.id);
        /** @type {ExerciseResponse | Exercise} */
        let exercise;
        if (Number.isNaN(idAsNumber)) {
            const globalExercises = await exercisesService.getGlobalExercises();
            exercise = globalExercises.find((globalExercise) => globalExercise.ID === workoutStartExercise.id);
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
        workoutStartExercise.sets.forEach((_set, index) => {
            const set = new ExerciseSet(exercise.ID, index);
            set.addEventListener('remove', this.updateSetsOnRemove);
            setsList.appendChild(set);
        });

        this.shadowRoot
            .getElementById(deleteButtonId)
            .addEventListener('click', this.deleteExercise);

        this.shadowRoot
            .getElementById(addButtonId)
            .addEventListener('click', this.addSet);
    }

    /** @param {Event} event  */
    updateSetsOnRemove(event) {
        if (!(event instanceof CustomEvent)
            || typeof event.detail !== 'number'
            || workoutsStartStore.getSetsAmount(this.#workoutExercise.id) === 1
        ) {
            return;
        }

        workoutsStartStore.removeSet(this.#workoutExercise.id, event.detail);
        this.shadowRoot
            .querySelectorAll('fit-exercise-set')
            .item(event.detail)
            .remove();
        const setElements = this.shadowRoot.querySelectorAll('fit-exercise-set');

        setElements.forEach((setElement, index) => {
            if (setElement instanceof ExerciseSet) {
                setElement.setIndex = index;
            }
        });
    }

    deleteExercise() {
        this.remove();
    }

    addSet() {
        workoutsStartStore.addSet(this.#workoutExercise.id);
        const setsWrapper = this.shadowRoot.querySelector('ul');
        const currentSetsAmount = workoutsStartStore.getSetsAmount(this.#workoutExercise.id);

        if (currentSetsAmount === undefined) {
            return;
        }

        const set = new ExerciseSet(this.#workoutExercise.id, currentSetsAmount - 1);
        set.addEventListener('remove', this.updateSetsOnRemove);
        setsWrapper.appendChild(set);
    }
}

customElements.define('fit-start-exercise-card', StartExerciseCard);