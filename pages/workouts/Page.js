import { appRouter, appRouterIds } from '/Routes.js';
import { workoutsService } from '/services/WorkoutsService.js';
import { AppRouterLink } from '/components/AppRouterLink.js';

export class WorkoutsPage extends HTMLElement {
	#ids = {
		userWorkouts: 'userWorkouts',
		workout: 'workout',
	}

	constructor() {
		super();

		this.attachShadow({ mode: 'open' }).innerHTML = `
			<style>
				@import url('/globals.css');
			</style>
			<div class="page-container">
				<h2>Workouts</h2>
				<fit-app-router-link route="${appRouterIds.workoutsAdd}">Workout hinzufügen</fit-app-router-link>
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
			workoutElement.id = `${this.#ids.workout}${workout.ID}`;

			workoutElement.innerHTML = `
				<h3>${workout.Name}</h3>
				<button type="button">Löschen</button>
				<fit-app-router-link route="${appRouterIds.workoutsEdit}">Bearbeiten</fit-app-router-link>
				<fit-app-router-link route="${appRouterIds.workoutsStart}">Starten</fit-app-router-link>
			`;

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