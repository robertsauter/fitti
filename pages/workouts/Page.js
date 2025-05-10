import { appRouter, appRouterIds } from '/Routes.js';
import { Link } from '/components/Link.js';
import { workoutsService } from '/services/WorkoutsService.js';
import { WorkoutsEditPageLink } from '/pages/workouts/components/EditPageLink.js';

export class WorkoutsPage extends HTMLElement {
	#ids = {
		userWorkouts: 'userWorkouts'
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

		let workoutElements = '';
		workouts.forEach((workout) => {
			workoutElements = `
				${workoutElements}
				<li>
					<h3>${workout.Name}</h3>
					<fit-workouts-edit-page-link workoutId=${workout.ID}>Bearbeiten</fit-workouts-edit-page-link>
				</li>
			`
		});

		this.shadowRoot.getElementById(this.#ids.userWorkouts).innerHTML = workoutElements;
	}
}

customElements.define('fit-workouts-page', WorkoutsPage);