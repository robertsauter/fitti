import { Icon } from '/components/Icon.js';
import { globalClassNames, iconNames } from '/Constants.js';

export class SettingsPage extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <div class="${globalClassNames.pageContainer}">
                <div class="${globalClassNames.titleWrapper}">
                    <div class="${globalClassNames.emojiCircle}">
                        <fit-icon name="${iconNames.gearEmoji}"></fit-icon>
                    </div>
                    <h1>Einstellungen</h1>
                </div>
            </div>
        `;
    }
}

customElements.define('fit-settings-page', SettingsPage);