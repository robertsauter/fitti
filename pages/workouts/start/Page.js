import { appRouter } from '/Routes.js';
import { workoutsService } from '/services/WorkoutsService.js';
import '/models/Workout.js';
import { StartExerciseCard } from '/pages/workouts/components/StartExerciseCard.js';
import { workoutsStartStore } from '/store/WorkoutsStartStore.js';
import { ExerciseSelect } from '/components/ExerciseSelect.js';

export class WorkoutsStartPage extends HTMLElement {
    #classes = {
        pageContainer: 'pageContainer'
    };

    constructor() {
        super();

        this.addExerciseSelect = this.addExerciseSelect.bind(this);
        this.addExercise = this.addExercise.bind(this);

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
        const exerciseElement = new StartExerciseCard();

        exerciseElement.workoutExercise = exercise;
        this.shadowRoot
            .querySelector('ul')
            .appendChild(exerciseElement);
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

        if (select instanceof ExerciseSelect) {
            const selectedExerciseId = select.selectedExerciseId;
            select.remove();
            this.#displayExercise({
                id: selectedExerciseId,
                sets: [],
            });
        }
    }
}

customElements.define('fit-workouts-start-page', WorkoutsStartPage);