import { errorMessages, globalClassNames, iconNames } from '/Constants.js';
import { styleSheetManager } from '/lib/StyleSheetManager.js';
import { Icon } from '/components/Icon.js';
import { exercisesService } from '/services/ExercisesService.js';
import { AddExerciseLink } from '/components/AddExerciseLink.js';

export class ExercisesList extends HTMLElement {
    constructor() {
        super();

        const componentStyleSheet = new CSSStyleSheet();
        componentStyleSheet.replaceSync(`
            .card {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            ul {
                list-style-type: disc;
                padding-left: 1rem;
            } 
        `);

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [styleSheetManager.sheet, componentStyleSheet];

        shadow.innerHTML = `
                <div class="card exercisesSection">
                    <h2>Übungen</h2>
                </div>
        `;
    }

    connectedCallback() {
        this.#displayExercisesSection();
    }

    async #displayExercisesSection() {
        const exercisesSection = this.shadowRoot?.querySelector('.exercisesSection');

        if (!exercisesSection) {
            throw new Error(errorMessages.elementNotFound);
        }

        const exercises = await exercisesService.getUserExercises();

        if (exercises.length === 0) {
            const infoText = document.createElement('p');
            infoText.textContent = 'Du hast bisher noch keine Übungen erstellt.';
            exercisesSection.appendChild(infoText);
        } else {
            const exercisesList = document.createElement('ul');

            exercises.forEach((exercise) => {
                const exerciseElement = document.createElement('li');
                exerciseElement.textContent = exercise.Name;
                exercisesList.appendChild(exerciseElement);
            });

            exercisesSection.appendChild(exercisesList);
        }

        const addExerciseLink = new AddExerciseLink();
        exercisesSection.appendChild(addExerciseLink);
    }
}

customElements.define('fit-exercises-list', ExercisesList);