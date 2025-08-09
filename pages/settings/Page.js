import { Icon } from '/components/Icon.js';
import { globalClassNames, iconNames } from '/Constants.js';
import { ExportButton } from '/pages/settings/components/ExportButton.js';

export class SettingsPage extends HTMLElement {

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
            </style>
            <div class="${globalClassNames.pageContainer}">
                <div class="${globalClassNames.titleWrapper}">
                    <div class="${globalClassNames.emojiCircle}">
                        <fit-icon name="${iconNames.gearEmoji}"></fit-icon>
                    </div>
                    <h1>Einstellungen</h1>
                </div>
                <div class="card">
                    <h2>Import/Export</h2>
                    <p>Hier kannst du deine gespeicherten Trainingsdaten herunterladen oder bereits aufgezeichnete Daten (z.B. von einem anderen Gerät) wieder hochladen.</p>
                    <h3>Daten importieren</h3>
                    <p><b>Achtung:</b> Deine gespeicherten Daten werden durch die hochgeladenen Daten überschrieben.</p>
                    <button class="button outlined textAndIcon">
                        Daten hochladen
                        <fit-icon name="${iconNames.uploadFilled}"></fit-icon>
                    </button>
                    <h3>Daten exportieren</h3>
                    <fit-export-button></fit-export-button>
                </div>
            </div>
        `;
    }
}

customElements.define('fit-settings-page', SettingsPage);