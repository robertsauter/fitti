export class PlansPage extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({ mode: 'open' }).innerHTML = `
			<p>Plans page</p> 
        `;
    }
}

customElements.define('fit-plans-page', PlansPage);