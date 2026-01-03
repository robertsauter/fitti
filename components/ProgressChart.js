import { formatDate } from "/lib/DateHelpers.js";

export class ProgressChart extends HTMLElement {
    #highestVolume;
    #width = 0;
    #height = 0;
    #chartWidth = 0;
    #chartHeight = 0;
    #offestX = 0;
    #offsetY = 0;
    #config = {
        startDate: new Date(2025, 10, 28),
        endDate: new Date(2025, 11, 28),
        data: [
            {
                Date: new Date(2025, 10, 28),
                Weight: 80,
                Reps: 5,
            },
            {
                Date: new Date(2025, 11, 10),
                Weight: 120,
                Reps: 5,
            },
            {
                Date: new Date(2025, 11, 15),
                Weight: 100,
                Reps: 5,
            },
            {
                Date: new Date(2025, 11, 28),
                Weight: 200,
                Reps: 5,
            },
        ],
    };
    /** @type {CanvasRenderingContext2D | null} */
    #context = null;

    constructor() {
        super();

        this.#highestVolume = this.#config.data
            .map((datapoint) => datapoint.Reps * datapoint.Weight)
            .sort((a, b) => a - b)
            .pop() ?? 0;
    }

    connectedCallback() {
        const parent = this.parentElement;

        if (parent === null) {
            return;
        }

        const parentStyles = getComputedStyle(parent)

        this.#width = parent.clientWidth - parseFloat(parentStyles.paddingLeft) - parseFloat(parentStyles.paddingRight);
        this.#height = this.#width / 3 * 2;
        this.#chartWidth = this.#width / 100 * 80;
        this.#chartHeight = this.#height / 100 * 80;
        this.#offestX = this.#width / 100 * 10;
        this.#offsetY = this.#height / 100 * 10;

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
            </style>
            <canvas width="${this.#width}" height="${this.#height}"></canvas>
        `;

        const canvas = this.shadowRoot?.querySelector('canvas');

        if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
            return;
        }

        this.#context = canvas.getContext('2d');

        if (this.#context === null) {
            return;
        }

        this.#context.font = '10px Nunito, Arial, Helvetica, sans-serif';

        this.#createXAxis();
        this.#createYAxis();
        this.#createLines();
    }

    #createXAxis() {
        if (this.#context === null) {
            return;
        }

        this.#context.strokeStyle = 'black';

        const startY = this.#height / 100 * 90;

        this.#context.beginPath();
        this.#context.moveTo(this.#offestX, startY);

        const endX = this.#offestX + this.#chartWidth;

        this.#context.lineTo(endX, startY);
        this.#context.stroke();

        this.#context.strokeStyle = 'grey';

        const middleY = this.#height / 100 * 50;
        this.#context.beginPath();
        this.#context.moveTo(this.#offestX - 5, middleY);
        this.#context.lineTo(endX, middleY);

        this.#context.moveTo(this.#offestX - 5, this.#offsetY);
        this.#context.lineTo(endX, this.#offsetY);
        this.#context.stroke();

        this.#context.fillText(String(Math.floor(this.#highestVolume / 2)), 0, middleY + 3);
        this.#context.fillText(String(this.#highestVolume), 0, this.#offsetY + 3);

        this.#context.fillText(formatDate(this.#config.startDate), 0, startY + 12);
        this.#context.fillText(formatDate(this.#config.endDate), endX - 25, startY + 12);
    }

    #createYAxis() {
        if (this.#context === null) {
            return;
        }

        this.#context.strokeStyle = 'black';

        this.#context.beginPath();
        this.#context.moveTo(this.#offestX, this.#offsetY);

        const endY = this.#offsetY + this.#chartHeight;

        this.#context.lineTo(this.#offestX, endY);
        this.#context.stroke();
    }

    #createLines() {
        if (this.#context === null) {
            return;
        }

        this.#context.strokeStyle = 'red';

        this.#context.beginPath();

        // TODO: Add dots and use moveTo for first coordinate
        this.#config.data.forEach((datapoint) => {
            const { x, y } = this.#getDatapointCoordinates(datapoint);
            this.#context?.lineTo(x, y);
        });

        this.#context.stroke();
    }

    #getDatapointCoordinates(datapoint) {
        const startTime = this.#config.startDate.getTime();
        const totalTime = this.#config.endDate.getTime() - startTime;
        const yTimeDifference = datapoint.Date.getTime() - startTime;
        const x = this.#chartWidth / totalTime * yTimeDifference + this.#offestX;

        const y = this.#chartHeight - this.#chartHeight / this.#highestVolume * datapoint.Reps * datapoint.Weight + this.#offsetY;

        return { x, y }
    }
}

customElements.define('fit-progress-chart', ProgressChart);