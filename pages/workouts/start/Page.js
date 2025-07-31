import { appRouter, appRouterIds } from '/Routes.js';
import { workoutsService } from '/services/WorkoutsService.js';
import '/models/Workout.js';
import { StartExerciseCard } from '/pages/workouts/components/StartExerciseCard.js';
import { workoutsStartStore } from '/store/WorkoutsStartStore.js';
import { ExerciseSelect } from '/components/ExerciseSelect.js';
import { customEventNames, globalClassNames, iconNames } from '/Constants.js';
import { exercisesService } from '/services/ExercisesService.js';
import { Icon } from '/components/Icon.js';
import { RandomGenderWorkoutEmoji } from '/components/RandomGenderWorkoutEmoji.js';

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
                @import url('/pages/workouts/start/Page.css');
            </style>
            <div class="${globalClassNames.pageContainer}">
                <div class="${globalClassNames.titleWrapper}">
                    <div class="${globalClassNames.emojiCircle}">
                        <fit-random-gender-workout-emoji></fit-random-gender-workout-emoji>
                        <fit-icon name="${iconNames.notepadEmoji}"></fit-icon>
                    </div>
                    <h1></h1>
                </div>
                <form>
                    <ul class="exercisesList"></ul>
                    <button
                        id="${this.#ids.addExerciseButton}"
                        class="button primary outlined textAndIcon"
                        type="button">
                        Übung hinzufügen
                        <fit-icon name="${iconNames.addFilled}"></fit-icon>
                    </button>
                    <button
                        id="${this.#ids.saveWorkoutButton}"
                        class="button primary textAndIcon"
                        type="submit">
                        Workout beenden
                        <fit-icon name="${iconNames.checkmarkCircle}"></fit-icon>
                    </button>
                </form>
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

        const header = this.shadowRoot?.querySelector('h1');
        if (header) {
            header.textContent = workout.Name;
        }

        this.#displayExercises();

        this.shadowRoot
            ?.getElementById(this.#ids.addExerciseButton)
            ?.addEventListener('click', this.addExerciseSelect);

        this.shadowRoot
            ?.querySelector('form')
            ?.addEventListener('submit', this.saveWorkout);
    }

    #displayFallback() {
        const container = this.shadowRoot?.querySelector(`.${globalClassNames.pageContainer}`);

        if (!container) {
            return;
        }

        container.innerHTML = `<p>Workout konnte nicht gefunden werden.</p>`;
    }

    #displayExercises() {
        workoutsStartStore.exercises.forEach(async (exercise) => {
            const doesExerciseExist = await exercisesService.doesExerciseExist(exercise.id);

            if (!doesExerciseExist) {
                return;
            }

            this.#displayExercise(exercise);
        });
    }

    /** @param {WorkoutStartExerxise} exercise  */
    #displayExercise(exercise) {
        const exerciseElement = this.createExerciseElement(exercise);

        this.shadowRoot
            ?.querySelector('ul')
            ?.appendChild(exerciseElement);
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
            ?.querySelector('ul')
            ?.appendChild(exerciseSelect);
    }

    /** @param {Event} event  */
    addExercise(event) {
        const select = event.currentTarget;

        if (!(select instanceof ExerciseSelect) || select.selectedExerciseId === null) {
            return;
        }

        if (workoutsStartStore.exercises.some((exercise) => exercise.id === select.selectedExerciseId)) {
            select.triggerExerciseInUseValidation();
            return;
        }

        select.resetValidation();

        const newExercise = workoutsStartStore.addExercise(select.selectedExerciseId);
        select.remove();
        this.#displayExercise(newExercise);

        const addButton = this.shadowRoot?.getElementById(this.#ids.addExerciseButton);

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

        if (previousCard === null || card.workoutExercise === null) {
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

        if (nextCard === null || card.workoutExercise === null) {
            return;
        }

        workoutsStartStore.moveExerciseDown(card.workoutExercise.id);

        const newCard = this.createExerciseElement(card.workoutExercise);
        nextCard.after(newCard);
        card.remove();
    }

    /** @param {SubmitEvent} event  */
    async saveWorkout(event) {
        event.preventDefault();

        try {
            await workoutsService.saveUserWorkout();
            appRouter.navigate(appRouterIds.workouts);
        } catch (_error) {
            console.error('An error occurred while saving');
        }
    }
}

customElements.define('fit-workouts-start-page', WorkoutsStartPage);