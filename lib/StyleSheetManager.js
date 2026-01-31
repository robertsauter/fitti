class StyleSheetManager {
    #sheet = new CSSStyleSheet();

    get sheet() {
        return this.#sheet;
    }

    initialize() {
        this.#sheet.replaceSync(`
            @font-face {
                font-family: "Nunito";
                src: url("/Nunito-VariableFont_wght.ttf");
            }

            :root {
                --lime: #CEFF1A;

                --dark-blue: #273043;

                --pink: #E5BEED;

                --background-primary: var(--lime);
                --background-secondary: var(--pink);
                --primary: var(--dark-blue);
                --error: red;
            }

            body {
                margin: 0;
                user-select: none;
                -webkit-user-select: none;
                font-family: Nunito, Arial, Helvetica, sans-serif;
                background-color: var(--background-primary);
                color: var(--primary);
            }

            h1 {
                font-size: 1.75rem;
                margin: 0;
            }

            h2 {
                font-size: 1.25rem;
                margin: 0;
            }

            h3 {
                font-size: 1rem;
                font-weight: bold;
                margin: 0;
            }

            p {
                margin: 0;
            }

            ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            summary {
                font-size: 1.25rem;
                font-weight: bold;
                margin: 0.5rem 0;
            }

            label {
                font-weight: bold;
                margin-left: 0.5rem;
            }

            input {
                border-radius: 9999px;
                border-width: 2px;
                border-color: var(--primary);
                padding: 0.5rem;
                border-style: solid;
                font-family: Nunito, Arial, Helvetica, sans-serif;
            }

            select {
                border-radius: 9999px;
                border-width: 2px;
                border-color: var(--primary);
                padding: 0.5rem;
                border-style: solid;
                background-color: white;
                font-family: Nunito, Arial, Helvetica, sans-serif;
            }

            textarea {
                border-radius: 1.5rem;
                border-width: 2px;
                border-color: var(--primary);
                padding: 0.5rem;
                border-style: solid;
                min-height: 5rem;
                font-family: Nunito, Arial, Helvetica, sans-serif;
            }

            dialog {
                width: 80%;
                height: 80%;
                border-radius: 1rem;
                border-style: none;
            }

            dialog::backdrop {
                background-color: black;
                opacity: 75%;
            }

            .pageContainer {
                padding: 2rem;
                padding-bottom: 7rem;
                display: flex;
                gap: 1.5rem;
                flex-direction: column;
            }

            .titleWrapper {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .emojiCircle {
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 9999px;
                padding: 0.5rem;
                background-color: white;
            }

            .card {
                padding: 1rem;
                border-radius: 1rem;
                background-color: white;
            }

            .inputWrapper {
                display: flex;
                flex-direction: column;
            }

            .headerContainer {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                gap: 0.5rem;
            }

            .button {
                font-size: 1rem;
                padding: 0.5rem 1.5rem;
                border-radius: 9999px;
                border-width: 0;
                color: white;
                background-color: var(--primary);
                font-family: Nunito, Arial, Helvetica, sans-serif;
                -webkit-tap-highlight-color: transparent;
            }

            .button:active {
                transform: scale(105%);
                transition: all 100ms ease-out;
            }

            .button.icon {
                padding: 0.5rem;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .button.textAndIcon {
                padding: 0.5rem 1.5rem;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 0.25rem;
            }

            .button.outlined {
                color: var(--primary);
                border-color: var(--primary);
                border-width: 2px;
                border-style: solid;
                background-color: transparent;
            }

            .button.error {
                color: white;
                background-color: var(--error);
            }

            .button.error.outlined {
                color: var(--error);
                border-color: var(--error);
                border-width: 2px;
                border-style: solid;
                background-color: transparent;
            }    
        `);
    }
}

export const styleSheetManager = new StyleSheetManager();