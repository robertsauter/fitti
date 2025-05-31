import { appRouter } from '/Routes.js';
import { workoutsService } from '/services/WorkoutsService.js';
import '/models/Workout.js';
import { StartExerciseCard } from '/pages/workouts/components/StartExerciseCard.js';
import { workoutsStartStore } from '/store/WorkoutsStartStore.js';
import { ExerciseSelect } from '/components/ExerciseSelect.js';
import { customEventNames } from '/Constants.js';

export class WorkoutsStartPage extends HTMLElement {
    #classes = {
        pageContainer: 'pageContainer'
    };

    constructor() {
        super();

        this.addExerciseSelect = this.addExerciseSelect.bind(this);
        this.addExercise = this.addExercise.bind(this);
        this.moveExerciseUp = this.moveExerciseUp.bind(this);
        this.moveExerciseDown = this.moveExerciseDown.bind(this);

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <div class="${this.#classes.pageContainer}">
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

        await workoutsStartStore.initializeExercises(Number(id));

        const workout = await workoutsService.getUserWorkout(Number(id));

        if (workout === undefined) {
            this.#displayFallback();
            return;
        }

        this.shadowRoot.querySelector('h2').textContent = workout.Name;
        this.#displayExercises();
    }

    #displayFallback() {
        this.shadowRoot.querySelector(`.${this.#classes.pageContainer}`).innerHTML = `<p>Workout konnte nicht gefunden werden.</p>`;
    }

    #displayExercises() {
        workoutsStartStore.exercises.forEach((exercise) => {
            this.#displayExercise(exercise);
        });

        const addButton = document.createElement('button');
        addButton.textContent = 'Übung hinzufügen';
        this.shadowRoot
            .querySelector(`.${this.#classes.pageContainer}`)
            .appendChild(addButton);

        addButton.addEventListener('click', this.addExerciseSelect);
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

    addExerciseSelect() {
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
}

customElements.define('fit-workouts-start-page', WorkoutsStartPage);