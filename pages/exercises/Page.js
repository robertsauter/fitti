import { appRouterIds } from '/Routes.js';
import { exercisesService } from '/services/ExercisesService.js';
import { AppRouterLink } from '/components/AppRouterLink.js';
import { buttonSizeClassNames, buttonVariantClassNames, globalClassNames } from '/Constants.js';

export class ExercisesPage extends HTMLElement {
    #ids = {
        globalExercises: 'globalExercises',
        userExercises: 'userExercises',
        addExerciseButton: 'addExerciseButton',
        exercise: 'exercise',
    };

    constructor() {
        super();

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
                .card {
                   display: flex;
                   flex-direction: column;
                   gap: 0.5rem; 
                }
                .headerWrapper {
                    display: flex;
                    justify-content: space-between;
                }
                .buttonsWrapper {
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                }
                ul {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
            </style>
            <div class="${globalClassNames.pageContainer}">
                <div class="${globalClassNames.headerContainer}">
                    <div class="${globalClassNames.titleWrapper}">
                        <div class="${globalClassNames.emojiCircle}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><g fill="none"><g filter="url(#f542idh)"><path fill="#ffb336" d="M7.968 7.844h-1.64L2.577 19.03C.843 24.938 3.977 29 8.797 29h12.827a8.391 8.391 0 1 0-8.01-11.221a.24.24 0 0 1-.223.159a.23.23 0 0 1-.207-.126z"/></g><path fill="url(#f542ida)" d="M7.968 7.844h-1.64L2.577 19.03C.843 24.938 3.977 29 8.797 29h12.827a8.391 8.391 0 1 0-8.01-11.221a.24.24 0 0 1-.223.159a.23.23 0 0 1-.207-.126z"/><path fill="url(#f542id0)" d="M7.968 7.844h-1.64L2.577 19.03C.843 24.938 3.977 29 8.797 29h12.827a8.391 8.391 0 1 0-8.01-11.221a.24.24 0 0 1-.223.159a.23.23 0 0 1-.207-.126z"/><path fill="url(#f542id1)" d="M7.968 7.844h-1.64L2.577 19.03C.843 24.938 3.977 29 8.797 29h12.827a8.391 8.391 0 1 0-8.01-11.221a.24.24 0 0 1-.223.159a.23.23 0 0 1-.207-.126z"/><path fill="url(#f542id2)" d="M7.968 7.844h-1.64L2.577 19.03C.843 24.938 3.977 29 8.797 29h12.827a8.391 8.391 0 1 0-8.01-11.221a.24.24 0 0 1-.223.159a.23.23 0 0 1-.207-.126z"/><circle cx="21.515" cy="20.609" r="8.391" fill="url(#f542id3)"/><path fill="url(#f542idb)" d="M7.32 5.039L6.296 7.934l.499.962a2.04 2.04 0 0 0 1.817 1.12h4.941a2.5 2.5 0 0 0 2.315-1.557l.087-.213a3.5 3.5 0 0 0-1.814-4.517l-1.774-.752c-2.172-.805-4.283.047-5.047 2.062"/><path fill="url(#f542id4)" d="M7.32 5.039L6.296 7.934l.499.962a2.04 2.04 0 0 0 1.817 1.12h4.941a2.5 2.5 0 0 0 2.315-1.557l.087-.213a3.5 3.5 0 0 0-1.814-4.517l-1.774-.752c-2.172-.805-4.283.047-5.047 2.062"/><path fill="url(#f542id5)" d="M7.32 5.039L6.296 7.934l.499.962a2.04 2.04 0 0 0 1.817 1.12h4.941a2.5 2.5 0 0 0 2.315-1.557l.087-.213a3.5 3.5 0 0 0-1.814-4.517l-1.774-.752c-2.172-.805-4.283.047-5.047 2.062"/><g filter="url(#f542idi)"><path fill="url(#f542idc)" d="m13.171 18.688l-6.625 8.718h13.782l-6.532-8.718z"/><path fill="url(#f542id6)" d="m13.171 18.688l-6.625 8.718h13.782l-6.532-8.718z"/><path fill="url(#f542id7)" d="m13.171 18.688l-6.625 8.718h13.782l-6.532-8.718z"/></g><g filter="url(#f542idj)"><path stroke="url(#f542idd)" stroke-linecap="round" stroke-width="1.5" d="m11.449 4.268l2.383.984c.402.148.91.68.964 1.46c.058.823-.524 1.485-.89 1.712"/></g><rect width="8.914" height="4.07" x="6.281" y="6.898" fill="url(#f542ide)" rx="2.035"/><rect width="8.914" height="4.07" x="6.281" y="6.898" fill="url(#f542id8)" rx="2.035"/><rect width="8.914" height="4.07" x="6.281" y="6.898" fill="url(#f542idf)" rx="2.035"/><path fill="url(#f542id9)" d="M10.653 5.009L10 6.929h3.75z"/><g filter="url(#f542idk)"><path fill="url(#f542idg)" d="m9.406 5.433l1.39.891v.612h-1.39z"/></g><defs><radialGradient id="f542id0" cx="0" cy="0" r="1" gradientTransform="matrix(1.09436 7.34375 -3.76675 .56132 10.406 15.656)" gradientUnits="userSpaceOnUse"><stop offset=".021" stop-color="#ffea5e"/><stop offset="1" stop-color="#ffea5e" stop-opacity="0"/></radialGradient><radialGradient id="f542id1" cx="0" cy="0" r="1" gradientTransform="matrix(0 -2.0625 .85938 0 13.468 17.453)" gradientUnits="userSpaceOnUse"><stop stop-color="#e49b48"/><stop offset="1" stop-color="#e49b48" stop-opacity="0"/></radialGradient><radialGradient id="f542id2" cx="0" cy="0" r="1" gradientTransform="matrix(-.87441 1.23133 -2.24067 -1.59119 9.804 10.624)" gradientUnits="userSpaceOnUse"><stop offset=".211" stop-color="#d4934e"/><stop offset="1" stop-color="#d4934e" stop-opacity="0"/></radialGradient><radialGradient id="f542id3" cx="0" cy="0" r="1" gradientTransform="rotate(140.981 10.078 13.894)scale(9.33157)" gradientUnits="userSpaceOnUse"><stop stop-color="#ffed59"/><stop offset="1" stop-color="#ffed59" stop-opacity="0"/></radialGradient><radialGradient id="f542id4" cx="0" cy="0" r="1" gradientTransform="rotate(-30.196 21.495 -14.268)scale(7.083 12.6242)" gradientUnits="userSpaceOnUse"><stop offset=".56" stop-color="#ffdd47" stop-opacity="0"/><stop offset="1" stop-color="#ffdd47"/></radialGradient><radialGradient id="f542id5" cx="0" cy="0" r="1" gradientTransform="rotate(-122.735 7.792 .644)scale(5.48766 7.79014)" gradientUnits="userSpaceOnUse"><stop offset=".742" stop-color="#d0a659" stop-opacity="0"/><stop offset=".961" stop-color="#d0a659"/></radialGradient><radialGradient id="f542id6" cx="0" cy="0" r="1" gradientTransform="matrix(1.81251 1.21874 -2.41974 3.59865 10.718 20.156)" gradientUnits="userSpaceOnUse"><stop stop-color="#ffe060"/><stop offset="1" stop-color="#ffe060" stop-opacity="0"/></radialGradient><radialGradient id="f542id7" cx="0" cy="0" r="1" gradientTransform="rotate(143.344 4.777 13.53)scale(1.67501 9.91772)" gradientUnits="userSpaceOnUse"><stop offset=".375" stop-color="#f99d45"/><stop offset="1" stop-color="#f99d45" stop-opacity="0"/></radialGradient><radialGradient id="f542id8" cx="0" cy="0" r="1" gradientTransform="rotate(137.353 5.226 7.046)scale(1.61445 1.40902)" gradientUnits="userSpaceOnUse"><stop stop-color="#ffeb64"/><stop offset="1" stop-color="#ffeb64" stop-opacity="0"/></radialGradient><radialGradient id="f542id9" cx="0" cy="0" r="1" gradientTransform="matrix(0 -1.21213 1.47114 0 11.492 7.08)" gradientUnits="userSpaceOnUse"><stop stop-color="#a55812"/><stop offset="1" stop-color="#f29b05" stop-opacity="0"/></radialGradient><linearGradient id="f542ida" x1="16" x2="16" y1="29.969" y2="27.031" gradientUnits="userSpaceOnUse"><stop stop-color="#d27a7f"/><stop offset="1" stop-color="#d27a7f" stop-opacity="0"/></linearGradient><linearGradient id="f542idb" x1="8.406" x2="16.843" y1="8.781" y2="6.781" gradientUnits="userSpaceOnUse"><stop stop-color="#e9a73e"/><stop offset="1" stop-color="#ffcc30"/></linearGradient><linearGradient id="f542idc" x1="13.421" x2="13.421" y1="18.688" y2="26.149" gradientUnits="userSpaceOnUse"><stop stop-color="#ffca40"/><stop offset="1" stop-color="#ffca40" stop-opacity="0"/></linearGradient><linearGradient id="f542idd" x1="14.812" x2="11.004" y1="6.717" y2="5.04" gradientUnits="userSpaceOnUse"><stop stop-color="#ffed67"/><stop offset="1" stop-color="#ffed67" stop-opacity="0"/></linearGradient><linearGradient id="f542ide" x1="8.687" x2="14.437" y1="9.406" y2="9.406" gradientUnits="userSpaceOnUse"><stop stop-color="#e9a73e"/><stop offset="1" stop-color="#ffc524"/></linearGradient><linearGradient id="f542idf" x1="10.738" x2="10.738" y1="11.624" y2="8.626" gradientUnits="userSpaceOnUse"><stop stop-color="#f0960f"/><stop offset="1" stop-color="#f0960f" stop-opacity="0"/></linearGradient><linearGradient id="f542idg" x1="10.39" x2="9.856" y1="5.906" y2="7.137" gradientUnits="userSpaceOnUse"><stop stop-color="#ffd863"/><stop offset="1" stop-color="#ffd863" stop-opacity="0"/></linearGradient><filter id="f542idh" width="28.811" height="22.656" x="2.094" y="6.344" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="1" dy="-1.5"/><feGaussianBlur stdDeviation="1.5"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix values="0 0 0 0 0.839216 0 0 0 0 0.541176 0 0 0 0 0.294118 0 0 0 1 0"/><feBlend in2="shape" result="effect1_innerShadow_20020_4291"/></filter><filter id="f542idi" width="15.781" height="10.719" x="5.546" y="17.688" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_20020_4291" stdDeviation=".5"/></filter><filter id="f542idj" width="6.851" height="7.657" x="9.699" y="2.517" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_20020_4291" stdDeviation=".5"/></filter><filter id="f542idk" width="2.391" height="2.502" x="8.906" y="4.933" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_20020_4291" stdDeviation=".25"/></filter></defs></g></svg>
                        </div>
                        <h1>Übungen</h1>
                    </div>
                    <fit-app-router-link route="${appRouterIds.exercisesAdd}" size="${buttonSizeClassNames.icon}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M10 2.5a.5.5 0 0 1 .5.5v6.5H17a.5.5 0 0 1 0 1h-6.5V17a.5.5 0 0 1-1 0v-6.5H3a.5.5 0 0 1 0-1h6.5V3a.5.5 0 0 1 .5-.5"/></svg>
                    </fit-app-router-link>
                </div>
                <details open>
                    <summary>Deine Übungen</summary>
                    <ul id="${this.#ids.userExercises}"></ul>
                </details>
                <details open>
                    <summary>Ausgewählte Übungen</summary>
                    <ul id="${this.#ids.globalExercises}"></ul>
                </details>
            </div>
        `;
    }

    connectedCallback() {
        this.#displayUserExercises();
        this.#displayGlobalExercises();
    }

    async #displayGlobalExercises() {
        const exercises = await exercisesService.getGlobalExercises();

        const globalExercisesElement = this.shadowRoot?.getElementById(this.#ids.globalExercises);

        if (!globalExercisesElement) {
            return;
        }

        exercises.forEach((exercise) => {
            const exerciseElement = document.createElement('li');
            exerciseElement.className = 'card';

            const nameElement = document.createElement('h2');
            nameElement.textContent = exercise.Name;
            exerciseElement.appendChild(nameElement);

            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = exercise.Description;
            exerciseElement.appendChild(descriptionElement);

            const historyLink = new AppRouterLink(appRouterIds.exerciseHistory, `
                Fortschritt
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M10.755 6.426a1.998 1.998 0 1 1 2.825 2.827a1.998 1.998 0 0 1-2.825-2.827m2.119.708a.998.998 0 1 0-1.413 1.411a.998.998 0 0 0 1.413-1.411m-1.125 7.37a1.5 1.5 0 0 1-1.703-.295l-.61-.609l-.732 1.22a.5.5 0 0 1-.782.097l-2.83-2.831a.5.5 0 0 1 .096-.782l1.22-.732l-.61-.61a1.5 1.5 0 0 1-.295-1.703l-1.12-1.12a.5.5 0 0 1 0-.707l1.06-1.06a3 3 0 0 1 3.413-.589l.938-.937a6.29 6.29 0 0 1 6.33-1.557c.76.238 1.357.834 1.595 1.595a6.29 6.29 0 0 1-1.557 6.33l-.937.938a3 3 0 0 1-.59 3.413l-1.059 1.06a.5.5 0 0 1-.707 0zm4.076-11.26a5.29 5.29 0 0 0-5.324 1.309l-.816.815l.004.004l-.707.707l-.004-.004l-2.122 2.122l.004.004l-.403.403a.5.5 0 0 0 .048.651l4.248 4.247a.5.5 0 0 0 .652.047l.402-.401l.003.004l2.122-2.122l-.003-.004l.707-.707l.003.004l.816-.816a5.29 5.29 0 0 0 1.31-5.325a1.43 1.43 0 0 0-.94-.938m-3.307 10.615l.704.705l.707-.707a2 2 0 0 0 .52-1.93zm-4.438-8.3a2 2 0 0 0-1.93.52l-.706.707l.705.704zm.627 7.312l-1.57-1.57l-.886.53l1.925 1.926zm-2.904 2.04a.5.5 0 1 0-.707-.706l-1.768 1.768a.5.5 0 1 0 .707.707zM4.388 12.79a.5.5 0 0 1 0 .707l-.71.709a.5.5 0 0 1-.706-.708l.709-.708a.5.5 0 0 1 .707 0m2.83 3.537a.5.5 0 0 0-.707-.707l-.709.709a.5.5 0 1 0 .707.707z"/></svg>
            `);
            historyLink.setAttribute('size', buttonSizeClassNames.textAndIcon);
            historyLink.setAttribute('data-id', exercise.ID);
            exerciseElement.appendChild(historyLink);


            globalExercisesElement.appendChild(exerciseElement);
        });
    }

    async #displayUserExercises() {
        const exercises = await exercisesService.getUserExercises();

        const exercisesElement = this.shadowRoot?.getElementById(this.#ids.userExercises);

        if (!exercisesElement) {
            return;
        }

        exercises.forEach((exercise) => {
            const exerciseElement = document.createElement('li');
            exerciseElement.id = `${this.#ids.exercise}${exercise.ID}`;
            exerciseElement.className = 'card';

            const headerWrapper = document.createElement('div');
            headerWrapper.className = 'headerWrapper';

            const nameElement = document.createElement('h2');
            nameElement.textContent = exercise.Name;
            headerWrapper.appendChild(nameElement);

            const buttonsWrapper = document.createElement('div');
            buttonsWrapper.className = 'buttonsWrapper';

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M8.5 4h3a1.5 1.5 0 0 0-3 0m-1 0a2.5 2.5 0 0 1 5 0h5a.5.5 0 0 1 0 1h-1.054l-1.194 10.344A3 3 0 0 1 12.272 18H7.728a3 3 0 0 1-2.98-2.656L3.554 5H2.5a.5.5 0 0 1 0-1zM9 8a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0zm2.5-.5a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 1 0V8a.5.5 0 0 0-.5-.5"/></svg>
            `
            deleteButton.className = 'button error outlined icon';
            deleteButton.addEventListener('click', () => this.#deleteExercise(exercise.ID));
            buttonsWrapper.appendChild(deleteButton);

            const editLink = new AppRouterLink(
                appRouterIds.exercisesEdit,
                `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M12.92 2.873a2.975 2.975 0 0 1 4.207 4.207l-.669.669l-4.207-4.207zM11.544 4.25l-7.999 7.999a2.44 2.44 0 0 0-.655 1.194l-.878 3.95a.5.5 0 0 0 .597.597l3.926-.873a2.5 2.5 0 0 0 1.234-.678l7.982-7.982z"/></svg>`
            );
            editLink.setAttribute('data-id', String(exercise.ID));
            editLink.setAttribute('variant', buttonVariantClassNames.outlined);
            editLink.setAttribute('size', buttonSizeClassNames.icon);
            buttonsWrapper.appendChild(editLink);

            headerWrapper.appendChild(buttonsWrapper);
            exerciseElement.appendChild(headerWrapper);

            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = exercise.Description;
            exerciseElement.appendChild(descriptionElement);

            const historyLink = new AppRouterLink(appRouterIds.exerciseHistory, `
                Fortschritt
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M10.755 6.426a1.998 1.998 0 1 1 2.825 2.827a1.998 1.998 0 0 1-2.825-2.827m2.119.708a.998.998 0 1 0-1.413 1.411a.998.998 0 0 0 1.413-1.411m-1.125 7.37a1.5 1.5 0 0 1-1.703-.295l-.61-.609l-.732 1.22a.5.5 0 0 1-.782.097l-2.83-2.831a.5.5 0 0 1 .096-.782l1.22-.732l-.61-.61a1.5 1.5 0 0 1-.295-1.703l-1.12-1.12a.5.5 0 0 1 0-.707l1.06-1.06a3 3 0 0 1 3.413-.589l.938-.937a6.29 6.29 0 0 1 6.33-1.557c.76.238 1.357.834 1.595 1.595a6.29 6.29 0 0 1-1.557 6.33l-.937.938a3 3 0 0 1-.59 3.413l-1.059 1.06a.5.5 0 0 1-.707 0zm4.076-11.26a5.29 5.29 0 0 0-5.324 1.309l-.816.815l.004.004l-.707.707l-.004-.004l-2.122 2.122l.004.004l-.403.403a.5.5 0 0 0 .048.651l4.248 4.247a.5.5 0 0 0 .652.047l.402-.401l.003.004l2.122-2.122l-.003-.004l.707-.707l.003.004l.816-.816a5.29 5.29 0 0 0 1.31-5.325a1.43 1.43 0 0 0-.94-.938m-3.307 10.615l.704.705l.707-.707a2 2 0 0 0 .52-1.93zm-4.438-8.3a2 2 0 0 0-1.93.52l-.706.707l.705.704zm.627 7.312l-1.57-1.57l-.886.53l1.925 1.926zm-2.904 2.04a.5.5 0 1 0-.707-.706l-1.768 1.768a.5.5 0 1 0 .707.707zM4.388 12.79a.5.5 0 0 1 0 .707l-.71.709a.5.5 0 0 1-.706-.708l.709-.708a.5.5 0 0 1 .707 0m2.83 3.537a.5.5 0 0 0-.707-.707l-.709.709a.5.5 0 1 0 .707.707z"/></svg>
            `);
            historyLink.setAttribute('data-id', String(exercise.ID));
            historyLink.setAttribute('size', buttonSizeClassNames.textAndIcon);
            exerciseElement.appendChild(historyLink);

            exercisesElement.appendChild(exerciseElement);
        });
    }

    /** @param {number} id  */
    async #deleteExercise(id) {
        await exercisesService.deleteUserExercise(id);
        this.shadowRoot
            ?.getElementById(`${this.#ids.exercise}${id}`)
            ?.remove();
    }
}

customElements.define('fit-exercises-page', ExercisesPage);