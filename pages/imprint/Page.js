import { globalClassNames, iconNames } from '/Constants.js';
import { styleSheetManager } from '/lib/StyleSheetManager.js';

export class ImprintPage extends HTMLElement {

    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [styleSheetManager.sheet];

        shadow.innerHTML = `
            <div class="${globalClassNames.pageContainer}">
                <div class="${globalClassNames.titleWrapper}">
                    <div class="${globalClassNames.emojiCircle}">
                        <fit-icon name="${iconNames.faceInCloudEmoji}"></fit-icon>
                    </div>
                    <h1>Impressum</h1>
                </div>
                <p>Gemacht von Robert Sauter</p>
                <p>Öffentliches Repository: <a href="https://github.com/robertsauter/fitti" target="_blank">github.com</a></p>
                <h2>Datenschutzrichtlinie (Privacy policy)</h2>
                <p>Diese Seite erfasst oder verarbeitet keinerlei Daten.</p>
                <p>(This website does not track or analyze any of your data.)</p>
            </div>
        `;
    }
}

customElements.define('fit-imprint-page', ImprintPage);