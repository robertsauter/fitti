import { appRouter, appRouterIds } from '/Routes.js';
import { workoutsService } from '/services/WorkoutsService.js';
import '/models/Workout.js';
import { StartExerciseCard } from '/pages/workouts/components/StartExerciseCard.js';
import { workoutsStartStore } from '/store/WorkoutsStartStore.js';
import { ExerciseSelect } from '/components/ExerciseSelect.js';
import { customEventNames, globalClassNames } from '/Constants.js';

export class WorkoutsStartPage extends HTMLElement {
    #ids = {
        addExerciseButton: 'addExerciseButton',
        saveWorkoutButton: 'saveWorkoutButton',
    };

    constructor() {
        super();

        this.addExerciseSelect = this.addExerciseSelect.bind(this);
        this.addExercise = this.addExercise.bind(this);
        this.moveExerciseUp = this.moveExerciseUp.bind(this);
        this.moveExerciseDown = this.moveExerciseDown.bind(this);
        this.saveWorkout = this.saveWorkout.bind(this);

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <div class="${globalClassNames.pageContainer}">
                <h2></h2>
                <ul></ul>
                <button id="${this.#ids.addExerciseButton}">Übung hinzufügen</button>
                <button id="${this.#ids.saveWorkoutButton}">Workout beenden</button>
            </div>
        `;
    }

    async connectedCallback() {
        const id = appRouter.getParamValue('id');

        if (id === null) {
            this.#displayFallback();
            return;
        }

        await workoutsStartStore.initializeExercises(Number(id));

        const workout = await workoutsService.getUserWorkout(Number(id));

        if (workout === undefined) {
            this.#displayFallback();
            return;
        }

        this.shadowRoot.querySelector('h2').textContent = workout.Name;
        this.#displayExercises();

        this.shadowRoot
            .getElementById(this.#ids.addExerciseButton)
            .addEventListener('click', this.addExerciseSelect);

        this.shadowRoot
            .getElementById(this.#ids.saveWorkoutButton)
            .addEventListener('click', this.saveWorkout);
    }

    #displayFallback() {
        this.shadowRoot.querySelector(`.${globalClassNames.pageContainer}`).innerHTML = `<p>Workout konnte nicht gefunden werden.</p>`;
    }

    #displayExercises() {
        workoutsStartStore.exercises.forEach((exercise) => {
            this.#displayExercise(exercise);
        });
    }

    /** @param {WorkoutStartExerxise} exercise  */
    #displayExercise(exercise) {
        const exerciseElement = this.createExerciseElement(exercise);

        this.shadowRoot
            .querySelector('ul')
            .appendChild(exerciseElement);
    }

    /** @param {WorkoutStartExerxise} exercise  */
    createExerciseElement(exercise) {
        const exerciseElement = new StartExerciseCard(exercise);
        exerciseElement.addEventListener(customEventNames.moveUp, this.moveExerciseUp);
        exerciseElement.addEventListener(customEventNames.moveDown, this.moveExerciseDown);
        return exerciseElement;
    }

    /** @param {Event} event  */
    addExerciseSelect(event) {
        const addButton = event.currentTarget;

        if (!(addButton instanceof HTMLButtonElement)) {
            return;
        }

        addButton.disabled = true;

        const exerciseSelect = new ExerciseSelect(workoutsStartStore.exercises.length + 1);

        exerciseSelect.addEventListener('change', this.addExercise);

        this.shadowRoot
            .querySelector('ul')
            .appendChild(exerciseSelect);
    }

    /** @param {Event} event  */
    addExercise(event) {
        const select = event.currentTarget;

        if (!(select instanceof ExerciseSelect)) {
            return;
        }

        // TODO: Add validation
        if (workoutsStartStore.exercises.some((exercise) => exercise.id === select.selectedExerciseId)) {
            return;
        }

        const newExercise = workoutsStartStore.addExercise(select.selectedExerciseId);
        select.remove();
        this.#displayExercise(newExercise);

        const addButton = this.shadowRoot.getElementById(this.#ids.addExerciseButton);

        if (!(addButton instanceof HTMLButtonElement)) {
            return;
        }

        addButton.disabled = false;
    }

    /** @param {Event} event  */
    moveExerciseUp(event) {
        const card = event.currentTarget;

        if (!(card instanceof StartExerciseCard)) {
            return;
        }

        const previousCard = card.previousElementSibling;

        if (previousCard === null) {
            return;
        }

        workoutsStartStore.moveExerciseUp(card.workoutExercise.id);

        const newCard = this.createExerciseElement(card.workoutExercise);;
        previousCard.before(newCard);
        card.remove();
    }

    /** @param {Event} event  */
    moveExerciseDown(event) {
        const card = event.currentTarget;

        if (!(card instanceof StartExerciseCard)) {
            return;
        }

        const nextCard = card.nextElementSibling;

        if (nextCard === null) {
            return;
        }

        workoutsStartStore.moveExerciseDown(card.workoutExercise.id);

        const newCard = this.createExerciseElement(card.workoutExercise);
        nextCard.after(newCard);
        card.remove();
    }

    async saveWorkout() {
        try {
            await workoutsService.saveUserWorkout();
            appRouter.navigate(appRouterIds.workouts);
        } catch (_error) {
            console.error('An error occurred while saving');
        }
    }
}

customElements.define('fit-workouts-start-page', WorkoutsStartPage);