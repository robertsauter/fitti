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

    /** @type {WorkoutStartExerxise} */
    #workoutExercise;


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
    }

    connectedCallback() {
        this.innerHTML = `
            <li class="exerciseCard card secondary">
                <h2></h2>
                <div class="buttonsCard card white"></div>
            </li>
        `;

        this.#displayExercise();
    }

    async #displayExercise() {
        const exercise = await exercisesService.getUserOrGlobalExercise(this.#workoutExercise.id);

        if (exercise === undefined) {
            this.deleteExercise();
            return;
        }

        const header = this.querySelector('h2');
        if (header !== null) {
            header.textContent = exercise.Name;
        }

        const buttonsCard = this.querySelector('.buttonsCard');
        const wrapperElement = this.querySelector('li');

        if (buttonsCard === null || wrapperElement === null) {
            return;
        }

        const buttonsWrapper = document.createElement('div');
        buttonsWrapper.className = 'buttonsWrapper';

        const upButtonId = `${this.#ids.upButton}${exercise.ID}`;
        const upButton = document.createElement('button');
        upButton.type = 'button';
        upButton.className = 'button secondary outlined';
        upButton.id = upButtonId;
        upButton.textContent = 'Oben';
        buttonsWrapper.appendChild(upButton);
        upButton.addEventListener('click', this.moveUp);

        const downButtonId = `${this.#ids.downButton}${exercise.ID}`;
        const downButton = document.createElement('button');
        downButton.type = 'button';
        downButton.className = 'button secondary outlined';
        downButton.id = downButtonId;
        downButton.textContent = 'Unten';
        buttonsWrapper.appendChild(downButton);
        downButton.addEventListener('click', this.moveDown);

        buttonsCard.appendChild(buttonsWrapper);

        const deleteButtonId = `${this.#ids.deleteButton}${exercise.ID}`;
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'button error outlined';
        deleteButton.id = deleteButtonId;
        deleteButton.textContent = 'Löschen';
        buttonsCard.appendChild(deleteButton);
        deleteButton.addEventListener('click', this.deleteExercise);

        wrapperElement.appendChild(buttonsCard);

        const setsList = document.createElement('ul');
        setsList.className = 'setsList';
        wrapperElement.appendChild(setsList);
        this.#workoutExercise.sets.forEach((set, index) => {
            const setElement = new ExerciseSet(exercise.ID, index, set);
            setElement.addEventListener(customEventNames.remove, this.updateSetsOnRemove);
            setsList.appendChild(setElement);
        });

        const addButtonId = `${this.#ids.addButton}${exercise.ID}`;
        const addButton = document.createElement('button');
        addButton.type = 'button';
        addButton.className = 'button secondary';
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
        this.querySelectorAll('fit-exercise-set')
            .item(event.detail)
            .remove();
        const setElements = this.querySelectorAll('fit-exercise-set');

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
        const setsWrapper = this.querySelector('ul');
        if (setsWrapper === null) {
            return;
        }

        workoutsStartStore.addSet(this.#workoutExercise.id);
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