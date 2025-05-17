import { appRouter, appRouterIds } from '/Routes.js';
import { plansService } from '/services/PlansService.js';
import { AppRouterLink } from '/components/AppRouterLink.js';

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
                <fit-app-router-link route="${appRouterIds.plansAdd}">Trainingsplan hinzufügen</fit-app-router-link>
                <ul id="${this.#ids.userPlans}"></ul>
            </div>
        `;
    }

    connectedCallback() {
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
                <fit-app-router-link route="${appRouterIds.plansEdit}" data-id="${plan.ID}">Bearbeiten</fit-app-router-link>
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