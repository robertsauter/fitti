export class HomePage extends HTMLElement {

	constructor() {
		super();

		this.attachShadow({ mode: 'open' }).innerHTML = `
          <p>Home page</p>
        `;
	}
}

customElements.define('fit-home-page', HomePage);