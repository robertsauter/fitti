import { Icon } from '/components/Icon.js';
import { globalClassNames, iconNames } from '/Constants.js';
import { styleSheetManager } from '/lib/StyleSheetManager.js';
import { ExportButton } from '/pages/settings/components/ExportButton.js';
import { ImportButton } from '/pages/settings/components/ImportButton.js';

export class SettingsPage extends HTMLElement {

    constructor() {
        super();

        const componentStyleSheet = new CSSStyleSheet();
        componentStyleSheet.replaceSync(`
            .card {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
        `);

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [styleSheetManager.sheet, componentStyleSheet];

        shadow.innerHTML = `
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
                    <fit-import-button></fit-import-button>
                    <h3>Daten exportieren</h3>
                    <fit-export-button></fit-export-button>
                </div>
            </div>
        `;
    }
}

customElements.define('fit-settings-page', SettingsPage);