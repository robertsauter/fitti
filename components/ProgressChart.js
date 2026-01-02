export class ProgressChart extends HTMLElement {
    #width;
    #height;
    #chartWidth;
    #chartHeight;
    #highestVolume;
    #offestX;
    #offsetY;
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

    /**
     * @param {number} width 
     * @param {number} height 
     */
    constructor(width, height) {
        super();

        this.#width = width;
        this.#height = height;
        this.#chartWidth = this.#width / 100 * 80;
        this.#chartHeight = this.#height / 100 * 80;
        this.#offestX = this.#width / 100 * 10;
        this.#offsetY = this.#height / 100 * 10;

        this.attachShadow({ mode: 'open' }).innerHTML = `
            <style>
                @import url('/globals.css');
                canvas {
                    image-rendering: pixelated;
                }
            </style>
            <canvas width="${width}" height="${height}"></canvas>
        `;

        this.#highestVolume = this.#config.data
            .map((datapoint) => datapoint.Reps * datapoint.Weight)
            .sort((a, b) => a - b)
            .pop() ?? 0;
    }

    connectedCallback() {
        const canvas = this.shadowRoot?.querySelector('canvas');

        if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
            return;
        }

        this.#context = canvas.getContext('2d');

        this.#createXAxis();
        this.#createYAxis();
        this.#createLines();
    }

    #createXAxis() {
        const startY = this.#height / 100 * 90;

        this.#context?.beginPath();
        this.#context?.moveTo(this.#offestX, startY);

        const endX = this.#offestX + this.#chartWidth;

        this.#context?.lineTo(endX, startY);
        this.#context?.stroke();
    }

    #createYAxis() {
        this.#context?.beginPath();
        this.#context?.moveTo(this.#offestX, this.#offsetY);

        const endY = this.#offsetY + this.#chartHeight;

        this.#context?.lineTo(this.#offestX, endY);
        this.#context?.stroke();
    }

    #createLines() {
        this.#context?.beginPath();

        this.#config.data.forEach((datapoint) => {
            const { x, y } = this.#getDatapointCoordinates(datapoint);
            this.#context?.lineTo(x, y);
        });

        this.#context?.stroke();
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