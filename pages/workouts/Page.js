import { appRouter, appRouterIds } from '/Routes.js';
import { Link } from '/components/Link.js';

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
	}
}

customElements.define('fit-workouts-page', WorkoutsPage);