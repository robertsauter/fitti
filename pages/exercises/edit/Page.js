import { globalClassNames } from '/Constants.js';
import { appRouter, appRouterIds } from '/Routes.js';
import { exercisesService } from '/services/ExercisesService.js';

export class ExercisesEditPage extends HTMLElement {
    #ids = {
        saveExerciseForm: 'saveExerciseForm'
    };

    #inputNames = {
        name: 'name',
        description: 'description'
    };

    /** @type {number | null} */
    #exerciseId = null;

    constructor() {
        super();

        this.saveExercise = this.saveExercise.bind(this);

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
            </style>
            <div class="${globalClassNames.pageContainer}">
                <div class="${globalClassNames.titleWrapper}">
                    <div class="${globalClassNames.emojiCircle}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><g fill="none"><g filter="url(#f542idh)"><path fill="#ffb336" d="M7.968 7.844h-1.64L2.577 19.03C.843 24.938 3.977 29 8.797 29h12.827a8.391 8.391 0 1 0-8.01-11.221a.24.24 0 0 1-.223.159a.23.23 0 0 1-.207-.126z"/></g><path fill="url(#f542ida)" d="M7.968 7.844h-1.64L2.577 19.03C.843 24.938 3.977 29 8.797 29h12.827a8.391 8.391 0 1 0-8.01-11.221a.24.24 0 0 1-.223.159a.23.23 0 0 1-.207-.126z"/><path fill="url(#f542id0)" d="M7.968 7.844h-1.64L2.577 19.03C.843 24.938 3.977 29 8.797 29h12.827a8.391 8.391 0 1 0-8.01-11.221a.24.24 0 0 1-.223.159a.23.23 0 0 1-.207-.126z"/><path fill="url(#f542id1)" d="M7.968 7.844h-1.64L2.577 19.03C.843 24.938 3.977 29 8.797 29h12.827a8.391 8.391 0 1 0-8.01-11.221a.24.24 0 0 1-.223.159a.23.23 0 0 1-.207-.126z"/><path fill="url(#f542id2)" d="M7.968 7.844h-1.64L2.577 19.03C.843 24.938 3.977 29 8.797 29h12.827a8.391 8.391 0 1 0-8.01-11.221a.24.24 0 0 1-.223.159a.23.23 0 0 1-.207-.126z"/><circle cx="21.515" cy="20.609" r="8.391" fill="url(#f542id3)"/><path fill="url(#f542idb)" d="M7.32 5.039L6.296 7.934l.499.962a2.04 2.04 0 0 0 1.817 1.12h4.941a2.5 2.5 0 0 0 2.315-1.557l.087-.213a3.5 3.5 0 0 0-1.814-4.517l-1.774-.752c-2.172-.805-4.283.047-5.047 2.062"/><path fill="url(#f542id4)" d="M7.32 5.039L6.296 7.934l.499.962a2.04 2.04 0 0 0 1.817 1.12h4.941a2.5 2.5 0 0 0 2.315-1.557l.087-.213a3.5 3.5 0 0 0-1.814-4.517l-1.774-.752c-2.172-.805-4.283.047-5.047 2.062"/><path fill="url(#f542id5)" d="M7.32 5.039L6.296 7.934l.499.962a2.04 2.04 0 0 0 1.817 1.12h4.941a2.5 2.5 0 0 0 2.315-1.557l.087-.213a3.5 3.5 0 0 0-1.814-4.517l-1.774-.752c-2.172-.805-4.283.047-5.047 2.062"/><g filter="url(#f542idi)"><path fill="url(#f542idc)" d="m13.171 18.688l-6.625 8.718h13.782l-6.532-8.718z"/><path fill="url(#f542id6)" d="m13.171 18.688l-6.625 8.718h13.782l-6.532-8.718z"/><path fill="url(#f542id7)" d="m13.171 18.688l-6.625 8.718h13.782l-6.532-8.718z"/></g><g filter="url(#f542idj)"><path stroke="url(#f542idd)" stroke-linecap="round" stroke-width="1.5" d="m11.449 4.268l2.383.984c.402.148.91.68.964 1.46c.058.823-.524 1.485-.89 1.712"/></g><rect width="8.914" height="4.07" x="6.281" y="6.898" fill="url(#f542ide)" rx="2.035"/><rect width="8.914" height="4.07" x="6.281" y="6.898" fill="url(#f542id8)" rx="2.035"/><rect width="8.914" height="4.07" x="6.281" y="6.898" fill="url(#f542idf)" rx="2.035"/><path fill="url(#f542id9)" d="M10.653 5.009L10 6.929h3.75z"/><g filter="url(#f542idk)"><path fill="url(#f542idg)" d="m9.406 5.433l1.39.891v.612h-1.39z"/></g><defs><radialGradient id="f542id0" cx="0" cy="0" r="1" gradientTransform="matrix(1.09436 7.34375 -3.76675 .56132 10.406 15.656)" gradientUnits="userSpaceOnUse"><stop offset=".021" stop-color="#ffea5e"/><stop offset="1" stop-color="#ffea5e" stop-opacity="0"/></radialGradient><radialGradient id="f542id1" cx="0" cy="0" r="1" gradientTransform="matrix(0 -2.0625 .85938 0 13.468 17.453)" gradientUnits="userSpaceOnUse"><stop stop-color="#e49b48"/><stop offset="1" stop-color="#e49b48" stop-opacity="0"/></radialGradient><radialGradient id="f542id2" cx="0" cy="0" r="1" gradientTransform="matrix(-.87441 1.23133 -2.24067 -1.59119 9.804 10.624)" gradientUnits="userSpaceOnUse"><stop offset=".211" stop-color="#d4934e"/><stop offset="1" stop-color="#d4934e" stop-opacity="0"/></radialGradient><radialGradient id="f542id3" cx="0" cy="0" r="1" gradientTransform="rotate(140.981 10.078 13.894)scale(9.33157)" gradientUnits="userSpaceOnUse"><stop stop-color="#ffed59"/><stop offset="1" stop-color="#ffed59" stop-opacity="0"/></radialGradient><radialGradient id="f542id4" cx="0" cy="0" r="1" gradientTransform="rotate(-30.196 21.495 -14.268)scale(7.083 12.6242)" gradientUnits="userSpaceOnUse"><stop offset=".56" stop-color="#ffdd47" stop-opacity="0"/><stop offset="1" stop-color="#ffdd47"/></radialGradient><radialGradient id="f542id5" cx="0" cy="0" r="1" gradientTransform="rotate(-122.735 7.792 .644)scale(5.48766 7.79014)" gradientUnits="userSpaceOnUse"><stop offset=".742" stop-color="#d0a659" stop-opacity="0"/><stop offset=".961" stop-color="#d0a659"/></radialGradient><radialGradient id="f542id6" cx="0" cy="0" r="1" gradientTransform="matrix(1.81251 1.21874 -2.41974 3.59865 10.718 20.156)" gradientUnits="userSpaceOnUse"><stop stop-color="#ffe060"/><stop offset="1" stop-color="#ffe060" stop-opacity="0"/></radialGradient><radialGradient id="f542id7" cx="0" cy="0" r="1" gradientTransform="rotate(143.344 4.777 13.53)scale(1.67501 9.91772)" gradientUnits="userSpaceOnUse"><stop offset=".375" stop-color="#f99d45"/><stop offset="1" stop-color="#f99d45" stop-opacity="0"/></radialGradient><radialGradient id="f542id8" cx="0" cy="0" r="1" gradientTransform="rotate(137.353 5.226 7.046)scale(1.61445 1.40902)" gradientUnits="userSpaceOnUse"><stop stop-color="#ffeb64"/><stop offset="1" stop-color="#ffeb64" stop-opacity="0"/></radialGradient><radialGradient id="f542id9" cx="0" cy="0" r="1" gradientTransform="matrix(0 -1.21213 1.47114 0 11.492 7.08)" gradientUnits="userSpaceOnUse"><stop stop-color="#a55812"/><stop offset="1" stop-color="#f29b05" stop-opacity="0"/></radialGradient><linearGradient id="f542ida" x1="16" x2="16" y1="29.969" y2="27.031" gradientUnits="userSpaceOnUse"><stop stop-color="#d27a7f"/><stop offset="1" stop-color="#d27a7f" stop-opacity="0"/></linearGradient><linearGradient id="f542idb" x1="8.406" x2="16.843" y1="8.781" y2="6.781" gradientUnits="userSpaceOnUse"><stop stop-color="#e9a73e"/><stop offset="1" stop-color="#ffcc30"/></linearGradient><linearGradient id="f542idc" x1="13.421" x2="13.421" y1="18.688" y2="26.149" gradientUnits="userSpaceOnUse"><stop stop-color="#ffca40"/><stop offset="1" stop-color="#ffca40" stop-opacity="0"/></linearGradient><linearGradient id="f542idd" x1="14.812" x2="11.004" y1="6.717" y2="5.04" gradientUnits="userSpaceOnUse"><stop stop-color="#ffed67"/><stop offset="1" stop-color="#ffed67" stop-opacity="0"/></linearGradient><linearGradient id="f542ide" x1="8.687" x2="14.437" y1="9.406" y2="9.406" gradientUnits="userSpaceOnUse"><stop stop-color="#e9a73e"/><stop offset="1" stop-color="#ffc524"/></linearGradient><linearGradient id="f542idf" x1="10.738" x2="10.738" y1="11.624" y2="8.626" gradientUnits="userSpaceOnUse"><stop stop-color="#f0960f"/><stop offset="1" stop-color="#f0960f" stop-opacity="0"/></linearGradient><linearGradient id="f542idg" x1="10.39" x2="9.856" y1="5.906" y2="7.137" gradientUnits="userSpaceOnUse"><stop stop-color="#ffd863"/><stop offset="1" stop-color="#ffd863" stop-opacity="0"/></linearGradient><filter id="f542idh" width="28.811" height="22.656" x="2.094" y="6.344" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="1" dy="-1.5"/><feGaussianBlur stdDeviation="1.5"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix values="0 0 0 0 0.839216 0 0 0 0 0.541176 0 0 0 0 0.294118 0 0 0 1 0"/><feBlend in2="shape" result="effect1_innerShadow_20020_4291"/></filter><filter id="f542idi" width="15.781" height="10.719" x="5.546" y="17.688" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_20020_4291" stdDeviation=".5"/></filter><filter id="f542idj" width="6.851" height="7.657" x="9.699" y="2.517" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_20020_4291" stdDeviation=".5"/></filter><filter id="f542idk" width="2.391" height="2.502" x="8.906" y="4.933" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_20020_4291" stdDeviation=".25"/></filter></defs></g></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><g fill="none"><path fill="url(#f1646ida)" d="M23.037 2.506a1.5 1.5 0 0 1 2.121 0l4.363 4.363a1.5 1.5 0 0 1 0 2.121L9.464 29.048l-6.485-6.485z"/><path fill="url(#f1646id0)" d="M23.037 2.506a1.5 1.5 0 0 1 2.121 0l4.363 4.363a1.5 1.5 0 0 1 0 2.121L9.464 29.048l-6.485-6.485z"/><path fill="url(#f1646id1)" d="M23.037 2.506a1.5 1.5 0 0 1 2.121 0l4.363 4.363a1.5 1.5 0 0 1 0 2.121L9.464 29.048l-6.485-6.485z"/><path fill="url(#f1646idb)" d="M23.037 2.506a1.5 1.5 0 0 1 2.121 0l4.363 4.363a1.5 1.5 0 0 1 0 2.121L9.464 29.048l-6.485-6.485z"/><path fill="url(#f1646id2)" d="M2.034 29.782a.2.2 0 0 0 .219.218l6.54-.629a1 1 0 0 0 .518-.205l.153-.118l-6.484-6.485l-.101.122a1 1 0 0 0-.224.543z"/><path fill="url(#f1646id3)" d="M2.034 29.782a.2.2 0 0 0 .219.218l6.54-.629a1 1 0 0 0 .518-.205l.153-.118l-6.484-6.485l-.101.122a1 1 0 0 0-.224.543z"/><path fill="url(#f1646id4)" d="M2.034 29.782a.2.2 0 0 0 .219.218l6.54-.629a1 1 0 0 0 .518-.205l.153-.118l-6.484-6.485l-.101.122a1 1 0 0 0-.224.543z"/><path fill="url(#f1646id5)" d="m26.34 12.172l3.18-3.182a1.5 1.5 0 0 0 0-2.121l-4.363-4.363a1.5 1.5 0 0 0-2.121 0l-3.182 3.182z"/><path fill="url(#f1646id6)" d="m26.34 12.172l3.18-3.182a1.5 1.5 0 0 0 0-2.121l-4.363-4.363a1.5 1.5 0 0 0-2.121 0l-3.182 3.182z"/><path fill="url(#f1646idc)" d="m26.34 12.172l3.18-3.182a1.5 1.5 0 0 0 0-2.121l-4.363-4.363a1.5 1.5 0 0 0-2.121 0l-3.182 3.182z"/><path fill="url(#f1646id7)" d="m16.666 8.877l3.19-3.19l6.484 6.485l-3.19 3.19z"/><path fill="url(#f1646id8)" d="m16.666 8.877l3.19-3.19l6.484 6.485l-3.19 3.19z"/><path fill="url(#f1646id9)" d="M2.253 30a.2.2 0 0 1-.219-.218l.218-2.3l2.296 2.297z"/><defs><linearGradient id="f1646id0" x1="10.136" x2="11.699" y1="14.875" y2="16.375" gradientUnits="userSpaceOnUse"><stop stop-color="#ee9b6a"/><stop offset="1" stop-color="#ee9b6a" stop-opacity="0"/></linearGradient><linearGradient id="f1646id1" x1="20.637" x2="18.762" y1="18.5" y2="16.938" gradientUnits="userSpaceOnUse"><stop stop-color="#e66a62"/><stop offset="1" stop-color="#e66a62" stop-opacity="0"/></linearGradient><linearGradient id="f1646id2" x1="3.887" x2="6.512" y1="26.094" y2="30.219" gradientUnits="userSpaceOnUse"><stop stop-color="#d8a587"/><stop offset="1" stop-color="#ce7a98"/></linearGradient><linearGradient id="f1646id3" x1="6.98" x2="6.457" y1="26.282" y2="26.812" gradientUnits="userSpaceOnUse"><stop offset=".207" stop-color="#ffc09f"/><stop offset="1" stop-color="#fcb196" stop-opacity="0"/></linearGradient><linearGradient id="f1646id4" x1="1.512" x2="3.637" y1="25.937" y2="26.125" gradientUnits="userSpaceOnUse"><stop stop-color="#debca3"/><stop offset="1" stop-color="#debca3" stop-opacity="0"/></linearGradient><linearGradient id="f1646id5" x1="28.074" x2="23.949" y1="4.938" y2="9" gradientUnits="userSpaceOnUse"><stop stop-color="#ff6153"/><stop offset="1" stop-color="#ff6154"/></linearGradient><linearGradient id="f1646id6" x1="20.762" x2="24.012" y1="4.563" y2="7.563" gradientUnits="userSpaceOnUse"><stop stop-color="#f1553e"/><stop offset="1" stop-color="#f1553e" stop-opacity="0"/></linearGradient><linearGradient id="f1646id7" x1="18.324" x2="22.449" y1="7.375" y2="11.125" gradientUnits="userSpaceOnUse"><stop stop-color="#c5c4cb"/><stop offset="1" stop-color="#e8defa"/></linearGradient><linearGradient id="f1646id8" x1="24.824" x2="22.512" y1="14.375" y2="12.125" gradientUnits="userSpaceOnUse"><stop stop-color="#c9b9e0"/><stop offset="1" stop-color="#c9b9e0" stop-opacity="0"/></linearGradient><linearGradient id="f1646id9" x1="2.23" x2="3.291" y1="28.531" y2="30.001" gradientUnits="userSpaceOnUse"><stop stop-color="#461e49"/><stop offset="1" stop-color="#450f51"/></linearGradient><radialGradient id="f1646ida" cx="0" cy="0" r="1" gradientTransform="matrix(13.74998 -14.06245 8.72293 8.5291 6.199 26)" gradientUnits="userSpaceOnUse"><stop stop-color="#ff9130"/><stop offset="1" stop-color="#f3633d"/></radialGradient><radialGradient id="f1646idb" cx="0" cy="0" r="1" gradientTransform="matrix(12.87503 -12.81253 2.8651 2.87908 5.949 25.813)" gradientUnits="userSpaceOnUse"><stop stop-color="#ff994d"/><stop offset="1" stop-color="#ff994d" stop-opacity="0"/></radialGradient><radialGradient id="f1646idc" cx="0" cy="0" r="1" gradientTransform="rotate(135 12.398 8.577)scale(1.37002 3.11227)" gradientUnits="userSpaceOnUse"><stop offset=".177" stop-color="#ff786d"/><stop offset="1" stop-color="#ff786d" stop-opacity="0"/></radialGradient></defs></g></svg>
                    </div>
                    <h1>Übung erstellen</h1>
                </div>
                <form id="${this.#ids.saveExerciseForm}">
                    <div class="${globalClassNames.inputWrapper}">
                        <label for="${this.#inputNames.name}">Name</label>
                        <input
                            id="${this.#inputNames.name}"
                            name="${this.#inputNames.name}"
                            type="text"
                            required />
                    </div>
                    <div class="${globalClassNames.inputWrapper}">
                        <label for="${this.#inputNames.description}">Beschreibung</label>
                        <textarea
                            id="${this.#inputNames.description}"
                            name="${this.#inputNames.description}"
                            required></textarea>
                    </div>
                    <button class="button textAndIcon" type="submit">
                        Speichern
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M3 5a2 2 0 0 1 2-2h8.379a2 2 0 0 1 1.414.586l1.621 1.621A2 2 0 0 1 17 6.621V15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1v-4.5A1.5 1.5 0 0 1 6.5 10h7a1.5 1.5 0 0 1 1.5 1.5V16a1 1 0 0 0 1-1V6.621a1 1 0 0 0-.293-.707l-1.621-1.621A1 1 0 0 0 13.379 4H13v2.5A1.5 1.5 0 0 1 11.5 8h-4A1.5 1.5 0 0 1 6 6.5V4zm2 0v2.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5V4zm7 12v-4.5a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5V16z"/></svg>                    </button>
                </form>
            </div>
        `;
    }

    connectedCallback() {
        this.shadowRoot
            ?.getElementById(this.#ids.saveExerciseForm)
            ?.addEventListener('submit', this.saveExercise);

        const id = appRouter.getParamValue('id');

        if (id !== null) {
            const header = this.shadowRoot?.querySelector('h1');

            if (header) {
                header.textContent = 'Übung bearbeiten';
            }

            this.#exerciseId = Number(id);
            this.#fillData();
        }
    }

    async #fillData() {
        if (this.#exerciseId === null) {
            return;
        }

        const exercise = await exercisesService.getUserExercise(this.#exerciseId);

        if (exercise === undefined) {
            appRouter.navigate(appRouterIds.exercisesAdd);
            return;
        }

        const nameInput = this.shadowRoot?.getElementById(this.#inputNames.name);

        if (nameInput instanceof HTMLInputElement) {
            nameInput.value = exercise.Name;
        }

        const descriptionInput = this.shadowRoot?.getElementById(this.#inputNames.description);

        if (descriptionInput instanceof HTMLTextAreaElement) {
            descriptionInput.value = exercise.Description;
        }
    }

    /** @param {SubmitEvent} event  */
    async saveExercise(event) {
        event.preventDefault();

        if (!(event.currentTarget instanceof HTMLFormElement)) {
            return;
        }

        const formData = new FormData(event.currentTarget);

        const name = formData.get(this.#inputNames.name)?.toString();
        const description = formData.get(this.#inputNames.description)?.toString();

        if (name === undefined || description === undefined) {
            return;
        }

        if (this.#exerciseId === null) {
            await exercisesService.addUserExercise({
                Name: name,
                Description: description,
            });
        } else {
            await exercisesService.putUserExercise({
                ID: this.#exerciseId,
                Name: name,
                Description: description,
            });
        }

        appRouter.navigate(appRouterIds.exercises);
    }
}

customElements.define('fit-exercises-edit-page', ExercisesEditPage);