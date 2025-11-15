import { iconNames } from '/Constants.js';
import { appRouter, appRouterIds } from '/Routes.js';
import { exercisesService } from '/services/ExercisesService.js';
import { workoutsService } from '/services/WorkoutsService.js';

export class DeleteExerciseButton extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <button class="button error icon">
                <fit-icon name="${iconNames.delete}"></fit-icon>
            </button>
        `
    }

    connectedCallback() {
        this.shadowRoot
            ?.querySelector('button')
            ?.addEventListener('click', this.deleteExercise);
    }

    async deleteExercise() {
        const id = appRouter.getParamValue('id');

        if (id === null) {
            return;
        }

        await exercisesService.deleteUserExercise(Number(id));

        appRouter.navigate(appRouterIds.exercises);
    }
}

customElements.define('fit-delete-exercise-button', DeleteExerciseButton);