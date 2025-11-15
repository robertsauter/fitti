import { appRouter, appRouterIds } from '/Routes.js';
import { workoutsService } from '/services/WorkoutsService.js';
import { AppRouterLink } from '/components/AppRouterLink.js';
import { buttonSizeClassNames, buttonVariantClassNames, globalClassNames, iconNames } from '/Constants.js';
import { RandomGenderWorkoutEmoji } from '/components/RandomGenderWorkoutEmoji.js';
import { Icon } from '/components/Icon.js';
import { workoutsStartStore } from '/store/WorkoutsStartStore.js';

export class WorkoutsPage extends HTMLElement {
	#ids = {
		userWorkouts: 'userWorkouts',
		workout: 'workout',
	};

	constructor() {
		super();

		this.attachShadow({ mode: 'open' }).innerHTML = `
			<style>
				@import url('/globals.css');
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
			</style>
			<div class="${globalClassNames.pageContainer}">
				<div class="${globalClassNames.headerContainer}">
					<div class="${globalClassNames.titleWrapper}">
						<div class="${globalClassNames.emojiCircle}">
							<fit-random-gender-workout-emoji></fit-random-gender-workout-emoji>
						</div>
						<h1>Workouts</h1>
					</div>
					<fit-app-router-link route="${appRouterIds.workoutsAdd}" size="${buttonSizeClassNames.icon}">
						<fit-icon name="${iconNames.add}"></fit-icon>
					</fit-app-router-link>
				</div>
				<fit-app-router-link route="${appRouterIds.workoutsHistory}" variant="${buttonVariantClassNames.outlined}" size="${buttonSizeClassNames.textAndIcon}">
					Beendete Workouts
					<fit-icon name="${iconNames.checkmarkCircleFilled}"></fit-icon>
				</fit-app-router-link>
				<ul id="${this.#ids.userWorkouts}"></ul>
			</div>
		`;
	}

	connectedCallback() {
		this.#displayUserWorkouts();
	}

	async #displayUserWorkouts() {
		const workouts = await workoutsService.getUserWorkouts();

		const workoutsElement = this.shadowRoot?.getElementById(this.#ids.userWorkouts);

		if (!workoutsElement) {
			return;
		}

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
	}
}

customElements.define('fit-workouts-page', WorkoutsPage);