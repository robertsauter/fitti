export class ExercisesPage extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <div class="page-container">
                <details open>
                    <summary>Ausgewählte Übungen</summary>
                    <ul id="global-exercises"></ul>
                </details>
                <details open>
                    <summary>Deine Übungen</summary>
                    <ul id="user-exercises"></ul>
                </details>
            </div>
        `;
    }
}

customElements.define('fit-exercises-page', ExercisesPage);