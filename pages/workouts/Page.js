export class WorkoutsPage extends HTMLElement {

	constructor() {
		super();

		this.attachShadow({ mode: 'open' }).innerHTML = `
			<p>Workouts page</p> 
        `;
	}
}

customElements.define('fit-workouts-page', WorkoutsPage);