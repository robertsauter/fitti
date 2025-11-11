import { Icon } from '/components/Icon.js';
import { iconNames, objectStoreNames } from '/Constants.js';
import { promiseIndexedDB } from '/lib/PromiseIndexedDB.js';
import { trainingDataParser } from '/lib/TrainingDataParser.js';

export class ImportButton extends HTMLElement {
    /** @type {TrainingData | null} */
    trainingData = null;

    constructor() {
        super();

        this.uploadData = this.uploadData.bind(this);
        this.importData = this.importData.bind(this);
        this.closeDialog = this.closeDialog.bind(this);

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
                label {
                    font-weight: normal;
                    margin: 0;
                }
                .dialogWrapper {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                dialog p {
                    word-break: break-word;
                }
                .dialogHeader {
                    padding-bottom: 1rem;
                }
                .dialogContent {
                    flex-grow: 1;
                    overflow-y: auto;
                }
                .dialogFooter {
                    padding-top: 1rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 0.5rem;
                }
            </style>
            <label class="button outlined textAndIcon">
                Daten hochladen
                <fit-icon name="${iconNames.uploadFilled}"></fit-icon>
                <input type="file" hidden />
            </label>
            <dialog>
                <div class="dialogWrapper">
                    <div class="dialogHeader">
                        <h3>Hochgeladene Daten</h3>
                    </div>
                    <div class="dialogContent">
                        <p></p>
                    </div>
                    <div class="dialogFooter">
                        <button class="button textAndIcon outlined cancelButton">
                            Abbrechen
                            <fit-icon name="${iconNames.dismissFilled}"></fit-icon>
                        </button>
                        <button class="button textAndIcon confirmButton">
                            Bestätigen
                            <fit-icon name="${iconNames.checkmarkCircle}"></fit-icon>
                        </button>
                    </div>
                </div>
            </dialog>
        `;
    }

    connectedCallback() {
        this.shadowRoot
            ?.querySelector('.cancelButton')
            ?.addEventListener('click', this.closeDialog);

        this.shadowRoot
            ?.querySelector('input')
            ?.addEventListener('change', this.uploadData);

        this.shadowRoot
            ?.querySelector('.confirmButton')
            ?.addEventListener('click', this.importData);
    }

    closeDialog() {
        this.shadowRoot
            ?.querySelector('dialog')
            ?.close();
    }

    /** @param {Event} event  */
    uploadData(event) {
        const input = event.currentTarget;

        if (!(input instanceof HTMLInputElement)) {
            return;
        }

        const file = input.files?.item(0);

        if (!file || file.type !== 'application/json') {
            return;
        }

        const fileReader = new FileReader();

        fileReader.onload = (fileReaderEvent) => {
            const jsonFile = fileReaderEvent.target?.result;

            if (typeof jsonFile !== 'string') {
                return;
            }

            const parsedJson = JSON.parse(jsonFile);
            this.trainingData = trainingDataParser.getTrainingData(parsedJson);


            const dialog = this.shadowRoot?.querySelector('dialog');
            const previewTextElement = dialog?.querySelector('p');

            if (!dialog || !previewTextElement) {
                return;
            }

            const previewText = JSON.stringify(this.trainingData);

            previewTextElement.textContent = previewText;

            dialog.showModal();
        }

        fileReader.readAsText(file);
    }

    async importData() {
        if (this.trainingData === null) {
            return;
        }

        if (this.trainingData.userExercises !== undefined) {
            await promiseIndexedDB.clear(objectStoreNames.userExercises);
            await promiseIndexedDB.putAll(objectStoreNames.userExercises, this.trainingData.userExercises);
        }

        if (this.trainingData.exerciseHistories !== undefined) {
            await promiseIndexedDB.clear(objectStoreNames.exerciseHistory);
            await promiseIndexedDB.putAll(objectStoreNames.exerciseHistory, this.trainingData.exerciseHistories);
        }

        if (this.trainingData.userWorkouts !== undefined) {
            await promiseIndexedDB.clear(objectStoreNames.userWorkouts);
            await promiseIndexedDB.putAll(objectStoreNames.userWorkouts, this.trainingData.userWorkouts);
        }

        if (this.trainingData.workoutHistory !== undefined) {
            await promiseIndexedDB.clear(objectStoreNames.workoutHistory);
            await promiseIndexedDB.putAll(objectStoreNames.workoutHistory, this.trainingData.workoutHistory);
        }

        this.closeDialog();
    }
}

customElements.define('fit-import-button', ImportButton);