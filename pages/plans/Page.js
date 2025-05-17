import { appRouter, appRouterIds } from '/Routes.js';
import { Link } from '/components/Link.js';
import { plansService } from '/services/PlansService.js';
import { PlansEditPageLink } from '/pages/plans/components/EditPageLink.js';

export class PlansPage extends HTMLElement {
    #ids = {
        userPlans: 'userPlans',
        plan: 'plan',
    }

    constructor() {
        super();

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
				@import url('/globals.css');
			</style>
			<div class="page-container">
                <h2>Trainingspläne</h2>
                <fit-link route="${appRouterIds.plansAdd}">Trainingsplan hinzufügen</fit-link>
                <ul id="${this.#ids.userPlans}"></ul>
            </div>
        `;
    }

    connectedCallback() {
        /** @type {Link} */
        const link = this.shadowRoot.querySelector('fit-link');
        link.router = appRouter;

        this.#displayUserPlans();
    }

    async #displayUserPlans() {
        const plans = await plansService.getUserPlans();

        const plansElement = this.shadowRoot.getElementById(this.#ids.userPlans);
        plans.forEach((plan) => {
            const planElement = document.createElement('li');
            planElement.id = `${this.#ids.plan}${plan.ID}`;

            planElement.innerHTML = `
                    <h3>${plan.Name}</h3>
                    <button type="button">Löschen</button>
                    <fit-plans-edit-page-link planId=${plan.ID}>Bearbeiten</fit-plans-edit-page-link>
                `;

            planElement
                .querySelector('button')
                .addEventListener('click', () => this.#deletePlan(plan.ID));

            plansElement.appendChild(planElement);
        });
    }

    /** @param {number} id  */
    async #deletePlan(id) {
        await plansService.deleteUserPlan(id);
        this.shadowRoot
            .getElementById(`${this.#ids.plan}${id}`)
            .remove();
    }
}

customElements.define('fit-plans-page', PlansPage);