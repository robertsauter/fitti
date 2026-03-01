import { appRouter, appRouterIds } from '/Routes.js';
import { workoutsService } from '/services/WorkoutsService.js';
import { AppRouterLink } from '/components/AppRouterLink.js';
import { buttonSizeClassNames, buttonVariantClassNames, globalClassNames, iconNames } from '/Constants.js';
import { RandomGenderWorkoutEmoji } from '/components/RandomGenderWorkoutEmoji.js';
import { Icon } from '/components/Icon.js';
import { workoutsStartStore } from '/store/WorkoutsStartStore.js';
import { styleSheetManager } from '/lib/StyleSheetManager.js';
import { exercisesService } from '/services/ExercisesService.js';

export class WorkoutsPage extends HTMLElement {
	#ids = {
		workout: 'workout',
	};

	constructor() {
		super();

		const componentStyleSheet = new CSSStyleSheet();
		componentStyleSheet.replaceSync(`
			ul {
				display: flex;
				flex-direction: column;
				gap: 1rem;
			}
			.card {
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
			}
			.buttonsWrapper {
				display: flex;
				align-items: center;
				gap: 0.5rem;
			}
        `);

		const shadow = this.attachShadow({ mode: 'open' });
		shadow.adoptedStyleSheets = [styleSheetManager.sheet, componentStyleSheet];

		shadow.innerHTML = `
			<div class="${globalClassNames.pageContainer}">
				<div class="${globalClassNames.headerContainer}">
					<div class="${globalClassNames.titleWrapper}">
						<div class="${globalClassNames.emojiCircle}">
							<fit-random-gender-workout-emoji></fit-random-gender-workout-emoji>
						</div>
						<h1>Workouts</h1>
					</div>
					<fit-app-router-link route="${appRouterIds.workoutsAdd}" size="${buttonSizeClassNames.icon}" class="addPageLink">
						<fit-icon name="${iconNames.add}"></fit-icon>
					</fit-app-router-link>
				</div>
			</div>
		`;
	}

	connectedCallback() {
		this.#displayUserWorkouts();
	}

	/** @param {Element} pageContainer  */
	async #displayHistoryButton(pageContainer) {
		const historyEntryCount = await workoutsService.getWorkoutHistoryEntryCount();

		if (historyEntryCount === 0) {
			return;
		}

		const historyButton = new AppRouterLink(appRouterIds.workoutsHistory, `
			Beendete Workouts
			<fit-icon name="${iconNames.checkmarkCircleFilled}"></fit-icon>
		`);
		historyButton.setAttribute('variant', buttonVariantClassNames.outlined);
		historyButton.setAttribute('size', buttonSizeClassNames.textAndIcon);
		historyButton.setAttribute('data-page', '0');

		pageContainer.appendChild(historyButton);
		return;
	}

	async #displayUserWorkouts() {
		const pageContainer = this.shadowRoot?.querySelector(`.${globalClassNames.pageContainer}`);

		if (!pageContainer) {
			return;
		}

		await this.#displayHistoryButton(pageContainer);

		const exercisesCount = await exercisesService.getExercisesCount();

		if (exercisesCount === 0) {
			const emptyTextElement = document.createElement('p');
			emptyTextElement.textContent = 'Bevor du ein Workout anlegen kannst, musst du zuerst Übungen erstellen.';
			pageContainer.appendChild(emptyTextElement);

			const addExerciseButton = new AppRouterLink(appRouterIds.exercisesAdd, `
				Übung erstellen
				<fit-icon name="${iconNames.add}"></fit-icon>
			`);
			addExerciseButton.setAttribute('size', buttonSizeClassNames.textAndIcon);
			pageContainer.appendChild(addExerciseButton);

			this.shadowRoot?.querySelector('.addPageLink')?.setAttribute('disabled', 'disabled');;

			return;
		}

		const workouts = await workoutsService.getUserWorkouts();

		if (workouts.length === 0) {
			const emptyTextElement = document.createElement('p');
			emptyTextElement.textContent = 'Du hast bisher noch kein Workout erstellt.';
			pageContainer.appendChild(emptyTextElement);

			return;
		}

		const workoutsElement = document.createElement('ul');

		workouts.forEach((workout) => {
			const workoutElement = document.createElement('li');
			workoutElement.className = 'card';
			workoutElement.id = `${this.#ids.workout}${workout.ID}`;

			const isWorkoutRunning = workoutsStartStore.workoutId === workout.ID;
			const buttonText = isWorkoutRunning ? 'Fortsetzen' : 'Starten';

			workoutElement.innerHTML = `
				<div class="${globalClassNames.headerContainer}">
					<h2></h2>	
					<div class="buttonsWrapper">
						<fit-app-router-link route="${appRouterIds.workoutsEdit}" variant="outlined" size="${buttonSizeClassNames.icon}">
							<fit-icon name="${iconNames.editFilled}"></fit-icon>
						</fit-app-router-link>
					</div>
				</div>
				<fit-app-router-link route="${appRouterIds.workoutsStart}" size="${buttonSizeClassNames.textAndIcon}">
					${buttonText}
					<fit-icon name="${iconNames.playSparkle}"></fit-icon>
				</fit-app-router-link>
			`;

			const header = workoutElement.querySelector('h2');

			if (header === null) {
				return;
			}

			header.textContent = workout.Name;

			workoutElement
				.querySelectorAll('fit-app-router-link')
				.forEach((link) => {
					link.setAttribute('data-id', String(workout.ID));
				});

			workoutsElement.appendChild(workoutElement);
		});

		pageContainer.appendChild(workoutsElement);
	}
}

customElements.define('fit-workouts-page', WorkoutsPage);