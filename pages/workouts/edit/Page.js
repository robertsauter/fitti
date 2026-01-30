import '/models/Workout.js';
import '/models/Exercise.js';
import { EditExerciseCard } from '/pages/workouts/components/EditExerciseCard.js';
import { workoutsService } from '/services/WorkoutsService.js';
import { appRouter, appRouterIds } from '/Routes.js';
import { globalClassNames, iconNames } from '/Constants.js';
import { exercisesService } from '/services/ExercisesService.js';
import { Icon } from '/components/Icon.js';
import { RandomGenderWorkoutEmoji } from '/components/RandomGenderWorkoutEmoji.js';
import { DeleteWorkoutButton } from '/pages/workouts/components/DeleteWorkoutButton.js';
import { styleSheetManager } from '/lib/StyleSheetManager.js';

export class WorkoutsEditPage extends HTMLElement {
    #ids = {
        exercisesList: 'exercisesList',
        addExerciseButton: 'addExerciseButton',
        workoutForm: 'workoutForm',
    };

    #inputNames = {
        name: 'name',
    };

    #exercisesAmount = 0;

    /** @type {number | null} */
    #workoutId = null;

    constructor() {
        super();

        this.saveWorkout = this.saveWorkout.bind(this);

        const componentStyleSheet = new CSSStyleSheet();
        componentStyleSheet.replaceSync(`
            form {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            ul {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
        `);

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [styleSheetManager.sheet, componentStyleSheet];

        shadow.innerHTML = `
            <div class="pageContainer">
                <div class="${globalClassNames.headerContainer}">
                    <div class="${globalClassNames.titleWrapper}">
                        <div class="${globalClassNames.emojiCircle}">
                            <fit-random-gender-workout-emoji></fit-random-gender-workout-emoji>
                            <fit-icon name="${iconNames.penEmoji}"></fit-icon>
                        </div>
                        <h1>Workout erstellen</h1>
                    </div>
                </div>
                <form id="${this.#ids.workoutForm}">
                    <div class="${globalClassNames.inputWrapper}">
                        <label for="${this.#inputNames.name}">Workout Name</label>
                        <input id="${this.#inputNames.name}" name="${this.#inputNames.name}" required />
                    </div>
                    <ul id="${this.#ids.exercisesList}"></ul>
                    <button
                        id="${this.#ids.addExerciseButton}"
                        type="button"
                        class="button outlined textAndIcon">
                        Übung hinzufügen
                        <fit-icon name="${iconNames.addFilled}"></fit-icon>
                    </button>
                    <button type="submit" class="button textAndIcon">
                        Speichern
                        <fit-icon name="${iconNames.save}"></fit-icon>
                    </button>
                </form>
            </div>
        `;
    }

    connectedCallback() {
        this.shadowRoot
            ?.getElementById(this.#ids.addExerciseButton)
            ?.addEventListener('click', () => this.addExercise());

        this.shadowRoot
            ?.getElementById(this.#ids.workoutForm)
            ?.addEventListener('submit', this.saveWorkout);

        const id = appRouter.getParamValue('id');

        if (id !== null) {
            const header = this.shadowRoot?.querySelector('h1');

            if (header) {
                header.textContent = 'Workout bearbeiten';
            }

            const headerContainer = this.shadowRoot?.querySelector(`.${globalClassNames.headerContainer}`);
            const deleteButton = new DeleteWorkoutButton();
            headerContainer?.appendChild(deleteButton);

            this.#workoutId = Number(id);
            this.#initializeWorkout();
        }
    }

    async #initializeWorkout() {
        if (this.#workoutId === null) {
            return;
        }

        const workout = await workoutsService.getUserWorkout(this.#workoutId);

        if (workout === undefined) {
            return;
        }

        const nameInput = this.shadowRoot?.getElementById(this.#inputNames.name);

        if (nameInput instanceof HTMLInputElement) {
            nameInput.value = workout.Name;
        }

        workout.Exercises.forEach(async (exercise) => {
            const doesExerciseExist = await exercisesService.doesExerciseExist(exercise.ID);

            if (!doesExerciseExist) {
                return;
            }

            this.addExercise(exercise);
        });
    }

    /** @param {WorkoutExercise} [exercise]  */
    addExercise(exercise) {
        const exerciseElement = new EditExerciseCard();

        exerciseElement.setAttribute('exerciseId', String(this.#exercisesAmount));

        if (exercise !== undefined) {
            exerciseElement.selectedExerciseId = exercise.ID;
            exerciseElement.setsAmount = String(exercise.Sets);
        }

        this.shadowRoot
            ?.getElementById(this.#ids.exercisesList)
            ?.appendChild(exerciseElement);

        this.#exercisesAmount += 1;
    }

    /** @param {SubmitEvent} event  */
    async saveWorkout(event) {
        event.preventDefault();

        if (!(event.currentTarget instanceof HTMLFormElement)) {
            return;
        }

        const formData = new FormData(event.currentTarget);
        const workoutName = formData.get(this.#inputNames.name);

        if (typeof workoutName !== 'string') {
            return;
        }

        /** @type {WorkoutExercise[]} */
        const exercises = [];
        this.shadowRoot
            ?.querySelectorAll('fit-edit-exercise-card')
            .forEach((card) => {
                if (!(card instanceof EditExerciseCard) || card.selectedExerciseId === null) {
                    return;
                }

                exercises.push({
                    ID: card.selectedExerciseId,
                    Sets: Number(card.setsAmount)
                });
            });

        // TODO: Add validation
        if (exercises.length < 1 || exercises.some((exercise) => exercise.ID === null)) {
            return;
        }

        if (this.#workoutId === null) {
            await workoutsService.addUserWorkout({
                Name: workoutName,
                Exercises: exercises,
            });
        } else {
            await workoutsService.putUserWorkout({
                ID: this.#workoutId,
                Name: workoutName,
                Exercises: exercises,
            });
        }

        appRouter.navigate(appRouterIds.workouts);
    }
}

customElements.define('fit-workouts-edit-page', WorkoutsEditPage);