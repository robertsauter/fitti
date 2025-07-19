import { appRouter, appRouterIds } from '/Routes.js';
import { workoutsService } from '/services/WorkoutsService.js';
import { AppRouterLink } from '/components/AppRouterLink.js';
import { buttonSizeClassNames, buttonVariantClassNames, globalClassNames } from '/Constants.js';
import { RandomGenderWorkoutEmoji } from '/components/RandomGenderWorkoutEmoji.js';

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
						<fit-random-gender-workout-emoji></fit-random-gender-workout-emoji>
						<h1>Workouts</h1>
					</div>
					<fit-app-router-link route="${appRouterIds.workoutsAdd}" size="${buttonSizeClassNames.icon}">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M10 2.5a.5.5 0 0 1 .5.5v6.5H17a.5.5 0 0 1 0 1h-6.5V17a.5.5 0 0 1-1 0v-6.5H3a.5.5 0 0 1 0-1h6.5V3a.5.5 0 0 1 .5-.5"/></svg>
					</fit-app-router-link>
				</div>
				<fit-app-router-link route="${appRouterIds.workoutsHistory}" variant="${buttonVariantClassNames.outlined}" size="${buttonSizeClassNames.textAndIcon}">
					Beendete Workouts
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m3.22 6.97l-4.47 4.47l-1.97-1.97a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l5-5a.75.75 0 1 0-1.06-1.06"/></svg>
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

			workoutElement.innerHTML = `
			<div class="${globalClassNames.headerContainer}">
				<h2></h2>	
				<div class="buttonsWrapper">
					<button type="button" class="button error outlined icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M8.5 4h3a1.5 1.5 0 0 0-3 0m-1 0a2.5 2.5 0 0 1 5 0h5a.5.5 0 0 1 0 1h-1.054l-1.194 10.344A3 3 0 0 1 12.272 18H7.728a3 3 0 0 1-2.98-2.656L3.554 5H2.5a.5.5 0 0 1 0-1zM9 8a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0zm2.5-.5a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 1 0V8a.5.5 0 0 0-.5-.5"/></svg>
					</button>
					<fit-app-router-link route="${appRouterIds.workoutsEdit}" variant="outlined" size="${buttonSizeClassNames.icon}">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M12.92 2.873a2.975 2.975 0 0 1 4.207 4.207l-.669.669l-4.207-4.207zM11.544 4.25l-7.999 7.999a2.44 2.44 0 0 0-.655 1.194l-.878 3.95a.5.5 0 0 0 .597.597l3.926-.873a2.5 2.5 0 0 0 1.234-.678l7.982-7.982z"/></svg>
					</fit-app-router-link>
				</div>
				</div>
				<fit-app-router-link route="${appRouterIds.workoutsStart}" size="${buttonSizeClassNames.textAndIcon}">
					Starten
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M16.088 6.412a2.84 2.84 0 0 0-1.347-.955l-1.378-.448a.544.544 0 0 1 0-1.025l1.378-.448A2.84 2.84 0 0 0 16.5 1.774l.011-.034l.448-1.377a.544.544 0 0 1 1.027 0l.447 1.377a2.84 2.84 0 0 0 1.799 1.796l1.377.448l.028.007a.544.544 0 0 1 0 1.025l-1.378.448a2.84 2.84 0 0 0-1.798 1.796l-.448 1.377l-.013.034a.544.544 0 0 1-1.013-.034l-.448-1.377a2.8 2.8 0 0 0-.45-.848m7.695 3.801l-.766-.248a1.58 1.58 0 0 1-.998-.999l-.25-.764a.302.302 0 0 0-.57 0l-.248.764a1.58 1.58 0 0 1-.984.999l-.765.248a.302.302 0 0 0 0 .57l.765.249a1.58 1.58 0 0 1 1 1.002l.248.764a.302.302 0 0 0 .57 0l.249-.764a1.58 1.58 0 0 1 .999-.999l.765-.248a.302.302 0 0 0 0-.57zM12 2c.957 0 1.883.135 2.76.386q-.175.107-.37.173l-1.34.44c-.287.103-.532.28-.713.508a8.5 8.5 0 1 0 8.045 9.909c.22.366.542.633 1.078.633q.185 0 .338-.04C20.868 18.57 16.835 22 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2m-1.144 6.155A1.25 1.25 0 0 0 9 9.248v5.504a1.25 1.25 0 0 0 1.856 1.093l5.757-3.189a.75.75 0 0 0 0-1.312z"/></svg>
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

			workoutElement
				.querySelector('button')
				?.addEventListener('click', () => this.#deleteExercise(workout.ID));

			workoutsElement.appendChild(workoutElement);
		});
	}

	/** @param {number} id  */
	async #deleteExercise(id) {
		await workoutsService.deleteUserWorkout(id);
		this.shadowRoot
			?.getElementById(`${this.#ids.workout}${id}`)
			?.remove();
	}
}

customElements.define('fit-workouts-page', WorkoutsPage);