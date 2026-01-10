import { AppRouterLink } from '/components/AppRouterLink.js';
import { buttonSizeClassNames, iconNames } from '/Constants.js';
import '/models/Pagination.js';
import { Icon } from '/components/Icon.js';
import { styleSheetManager } from '/lib/StyleSheetManager.js';

export class PaginationButtons extends HTMLElement {
    #pageId;
    #pagination;

    /**
     * @param {string} pageId 
     * @param {Pagination} pagination 
     */
    constructor(pageId, pagination) {
        super();

        const componentStyleSheet = new CSSStyleSheet();
        componentStyleSheet.replaceSync(`
            .paginationContainer {
                display: flex;
                justify-content: space-between;
            }
        `);

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [styleSheetManager.sheet, componentStyleSheet];

        shadow.innerHTML = `
            <div class="paginationContainer">
                <div class="backButtonContainer"></div>
                <div class="forwardButtonContainer"></div>
            </div>
        `;

        this.#pageId = pageId;
        this.#pagination = pagination;
    }

    connectedCallback() {


        if (this.#pagination.currentPage > 0) {
            const container = this.shadowRoot?.querySelector('.backButtonContainer');
            const backButton = new AppRouterLink(this.#pageId, `<fit-icon name="${iconNames.arrowLeft}"></fit-icon>`);
            backButton.setAttribute('data-page', String(this.#pagination.currentPage - 1));
            backButton.setAttribute('size', buttonSizeClassNames.icon);
            container?.appendChild(backButton);
        }

        if (this.#pagination.pagesCount > this.#pagination.currentPage + 1) {
            const container = this.shadowRoot?.querySelector('.forwardButtonContainer');
            const forwardButton = new AppRouterLink(this.#pageId, `<fit-icon name="${iconNames.arrowRight}"></fit-icon>`);
            forwardButton.setAttribute('data-page', String(this.#pagination.currentPage + 1));
            forwardButton.setAttribute('size', buttonSizeClassNames.icon);
            container?.appendChild(forwardButton);
        }
    }
}

customElements.define('fit-pagination-buttons', PaginationButtons);