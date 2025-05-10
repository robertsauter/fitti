import { appRouter, appRouterIds } from '/Routes.js';
import { Link } from '/components/Link.js';
import { workoutsService } from '/services/WorkoutsService.js';
import { WorkoutsEditPageLink } from '/pages/workouts/components/EditPageLink.js';

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
				<fit-link route="${appRouterIds.workoutsAdd}">Workout hinzufügen</fit-link>
				<ul id="${this.#ids.userWorkouts}"></ul>
			</div>
	`;
	}

	connectedCallback() {
		/** @type {Link} */
		const link = this.shadowRoot.querySelector('fit-link');
		link.router = appRouter;

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
				<fit-workouts-edit-page-link workoutId=${workout.ID}>Bearbeiten</fit-workouts-edit-page-link>
			`;

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