import { Icon } from '/components/Icon.js';
import { iconNames } from '/Constants.js';
import { styleSheetManager } from '/lib/StyleSheetManager.js';
import { exercisesService } from '/services/ExercisesService.js';
import { workoutsService } from '/services/WorkoutsService.js';

export class ExportButton extends HTMLElement {

    constructor() {
        super();

        this.exportData = this.exportData.bind(this);

        const componentStyleSheet = new CSSStyleSheet();
        componentStyleSheet.replaceSync(`
            button {
                width: 100%;
            }
        `);

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [styleSheetManager.sheet, componentStyleSheet];

        shadow.innerHTML = `
            <button class="button outlined textAndIcon">
                Daten herunterladen
                <fit-icon name="${iconNames.downloadFilled}"></fit-icon>
            </button>
        `;
    }

    connectedCallback() {
        this.shadowRoot
            ?.querySelector('button')
            ?.addEventListener('click', this.exportData);
    }

    async exportData() {
        const userExercises = await exercisesService.getUserExercises();

        const exerciseHistories = await Promise.all(userExercises.map(async (exercise) => {
            return exercisesService.getExerciseHistory(exercise.ID);
        }));

        const userWorkouts = await workoutsService.getUserWorkouts();
        const workoutHistory = await workoutsService.getWorkoutHistory();

        const trainingData = {
            userExercises,
            exerciseHistories,
            userWorkouts,
            workoutHistory,
        }

        const downloadLink = document.createElement('a');
        downloadLink.href = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(trainingData))}`;
        downloadLink.download = 'trainingsplanBackup.json';
        downloadLink.click();
    }
}

customElements.define('fit-export-button', ExportButton);