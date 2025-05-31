import '/models/Workout.js';
import { exercisesService } from '/services/ExercisesService.js';
import '/models/Exercise.js';
import '/models/ExerciseResponse.js';
import { ExerciseSet } from '/pages/workouts/components/ExerciseSet.js';
import { workoutsStartStore } from '/store/WorkoutsStartStore.js';
import { customEventNames } from '/Constants.js';

export class StartExerciseCard extends HTMLElement {
    #ids = {
        deleteButton: 'deleteButton',
        addButton: 'addButton',
        upButton: 'upButton',
        downButton: 'downButton',
    };

    /** @type {WorkoutStartExerxise | null} */
    #workoutExercise = null;


    get workoutExercise() {
        return this.#workoutExercise;
    }

    /** @param {WorkoutStartExerxise} exercise */
    constructor(exercise) {
        super();

        this.deleteExercise = this.deleteExercise.bind(this);
        this.addSet = this.addSet.bind(this);
        this.updateSetsOnRemove = this.updateSetsOnRemove.bind(this);
        this.moveUp = this.moveUp.bind(this);
        this.moveDown = this.moveDown.bind(this);

        this.#workoutExercise = exercise;

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <li></li>
        `;
    }

    connectedCallback() {
        this.#displayExercise();
    }

    async #displayExercise() {
        const idAsNumber = Number(this.#workoutExercise.id);
        /** @type {ExerciseResponse | Exercise} */
        let exercise;
        if (Number.isNaN(idAsNumber)) {
            const globalExercises = await exercisesService.getGlobalExercises();
            exercise = globalExercises.find((globalExercise) => globalExercise.ID === this.#workoutExercise.id);
        } else {
            exercise = await exercisesService.getUserExercise(idAsNumber);
        }

        const wrapperElement = this.shadowRoot.querySelector('li');

        const titleElement = document.createElement('h3');
        titleElement.textContent = exercise.Name;
        wrapperElement.appendChild(titleElement);

        const upButtonId = `${this.#ids.upButton}${exercise.ID}`;
        const upButton = document.createElement('button');
        upButton.id = upButtonId;
        upButton.textContent = 'Oben';
        wrapperElement.appendChild(upButton);
        upButton.addEventListener('click', this.moveUp);

        const downButtonId = `${this.#ids.downButton}${exercise.ID}`;
        const downButton = document.createElement('button');
        downButton.id = downButtonId;
        downButton.textContent = 'Unten';
        wrapperElement.appendChild(downButton);
        downButton.addEventListener('click', this.moveDown);

        const deleteButtonId = `${this.#ids.deleteButton}${exercise.ID}`;
        const deleteButton = document.createElement('button');
        deleteButton.id = deleteButtonId;
        deleteButton.textContent = 'Löschen';
        wrapperElement.appendChild(deleteButton);
        deleteButton.addEventListener('click', this.deleteExercise);

        const setsList = document.createElement('ul');
        wrapperElement.appendChild(setsList);
        this.#workoutExercise.sets.forEach((set, index) => {
            const setElement = new ExerciseSet(exercise.ID, index, set);
            setElement.addEventListener(customEventNames.remove, this.updateSetsOnRemove);
            setsList.appendChild(setElement);
        });

        const addButtonId = `${this.#ids.addButton}${exercise.ID}`;
        const addButton = document.createElement('button');
        addButton.id = addButtonId;
        addButton.textContent = 'Set hinzufügen';
        wrapperElement.appendChild(addButton);
        addButton.addEventListener('click', this.addSet);
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
            if (!(setElement instanceof ExerciseSet)) {
                return;
            }

            setElement.setIndex = index;
        });
    }

    deleteExercise() {
        workoutsStartStore.removeExercise(this.#workoutExercise.id);
        this.remove();
    }

    addSet() {
        workoutsStartStore.addSet(this.#workoutExercise.id);
        const setsWrapper = this.shadowRoot.querySelector('ul');
        const currentSetsAmount = workoutsStartStore.getSetsAmount(this.#workoutExercise.id);

        if (currentSetsAmount === undefined) {
            return;
        }

        const set = new ExerciseSet(this.#workoutExercise.id, currentSetsAmount - 1, {
            weight: null,
            reps: null,
        });
        set.addEventListener(customEventNames.remove, this.updateSetsOnRemove);
        setsWrapper.appendChild(set);
    }

    moveUp() {
        this.dispatchEvent(new Event(customEventNames.moveUp));
    }

    moveDown() {
        this.dispatchEvent(new Event(customEventNames.moveDown));
    }
}

customElements.define('fit-start-exercise-card', StartExerciseCard);