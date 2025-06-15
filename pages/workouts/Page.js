import { appRouter, appRouterIds } from '/Routes.js';
import { workoutsService } from '/services/WorkoutsService.js';
import { AppRouterLink } from '/components/AppRouterLink.js';
import { globalClassNames } from '/Constants.js';

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
				li {
					display: flex;
					flex-direction: column;
					gap: 0.5rem;
				}
				.buttonsWrapper {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.5rem;
                }
			</style>
			<div class="${globalClassNames.pageContainer}">
				<div class="${globalClassNames.headerContainer}">
					<h1>Workouts</h1>
					<fit-app-router-link route="${appRouterIds.workoutsAdd}">Workout hinzufügen</fit-app-router-link>
				</div>
				<fit-app-router-link route="${appRouterIds.workoutsHistory}" variant="outlined">Beendete Workouts</fit-app-router-link>
				<ul id="${this.#ids.userWorkouts}"></ul>
			</div>
		`;
	}

	connectedCallback() {
		this.#displayUserWorkouts();
	}

	async #displayUserWorkouts() {
		const workouts = await workoutsService.getUserWorkouts();

		const workoutsElement = this.shadowRoot.getElementById(this.#ids.userWorkouts);
		workouts.forEach((workout) => {
			const workoutElement = document.createElement('li');
			workoutElement.className = 'card secondary';
			workoutElement.id = `${this.#ids.workout}${workout.ID}`;

			workoutElement.innerHTML = `
				<h2></h2>	
				<div class="buttonsWrapper">
					<button type="button" class="button error outlined">Löschen</button>
					<fit-app-router-link route="${appRouterIds.workoutsEdit}" variant="outlined" color="secondary">Bearbeiten</fit-app-router-link>
				</div>
				<fit-app-router-link route="${appRouterIds.workoutsStart}" color="secondary">Starten</fit-app-router-link>
			`;

			workoutElement.querySelector('h2').textContent = workout.Name;

			workoutElement
				.querySelectorAll('fit-app-router-link')
				.forEach((link) => {
					link.setAttribute('data-id', String(workout.ID));
				});

			workoutElement
				.querySelector('button')
				.addEventListener('click', () => this.#deleteExercise(workout.ID));

			workoutsElement.appendChild(workoutElement);
		});
	}

	/** @param {number} id  */
	async #deleteExercise(id) {
		await workoutsService.deleteUserWorkout(id);
		this.shadowRoot
			.getElementById(`${this.#ids.workout}${id}`)
			.remove();
	}
}

customElements.define('fit-workouts-page', WorkoutsPage);