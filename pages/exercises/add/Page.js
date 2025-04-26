
export class ExercisesAddPage extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <div class="page-container">
                <p>Übung hinzufügen!!!</p>
            </div>
        `;
    }
}

customElements.define('fit-exercises-add-page', ExercisesAddPage);