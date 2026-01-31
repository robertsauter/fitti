import { formatDate, isSameDay } from '/lib/DateHelpers.js';
import '/models/TimePeriod.js';
import { exercisesService } from '/services/ExercisesService.js';
import '/models/Exercise.js';
import { styleSheetManager } from '/lib/StyleSheetManager.js';

export class ProgressChart extends HTMLElement {
    #exerciseId;
    #highestVolume = 0;
    #highestWeight = 0;
    #width = 0;
    #height = 0;
    #chartWidth = 0;
    #chartHeight = 0;
    #offestX = 0;
    #offsetY = 0;
    #axisColor = '#273043';
    #lineColor = '#c44536';
    #helperLineColor = '#E5BEED';
    #isVolumeMode = false;
    /** @type {TimePeriod} */
    #timePeriod = {
        startDate: new Date(),
        endDate: new Date(),
    };
    /** @type {ExerciseHistoryEntry[]} */
    #filteredExerciseHistory = [];
    /** @type {ExerciseHistoryEntry[]} */
    #exerciseHistory = [];
    /** @type {CanvasRenderingContext2D | null} */
    #context = null;
    /** @type {HTMLCanvasElement | null} */
    #canvas = null;

    /** @param {number} exerciseId */
    constructor(exerciseId) {
        super();

        this.handleTimePeriodChange = this.handleTimePeriodChange.bind(this);
        this.toggleMode = this.toggleMode.bind(this);

        this.#exerciseId = exerciseId;
        this.#changeTimePeriod('month');
    }

    async connectedCallback() {
        const history = (await exercisesService.getExerciseHistory(this.#exerciseId)).History;
        this.#exerciseHistory = exercisesService
            .filterHistoryByHighestWeight(history)
            .map((historyEntry) => {
                const date = new Date(historyEntry.Date);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(2);

                return {
                    ...historyEntry,
                    Date: date,
                }
            });

        const componentStyleSheet = new CSSStyleSheet();
        componentStyleSheet.replaceSync(`
            select {
                width: 100%;
            }
            .progressWrapper {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            .modeWrapper {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 0.5rem;
            }
            .modeWrapper button {
                text-wrap-mode: nowrap;
            }
        `);

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [styleSheetManager.sheet, componentStyleSheet];

        shadow.innerHTML = `
            <div class="card progressWrapper">
                <h2>Übersicht</h2>
                <select>
                    <option value="month">Letzter Monat</option>
                    <option value="year">Letzes Jahr</option>
                    <option value="all">Alle Daten bis heute</option>
                </select>
                <div class="modeWrapper">
                    <p>Gewicht</p>
                    <button class="button outlined">Modus wechseln</button>
                </div>
            </div>
        `;

        const progressWrapper = shadow.querySelector('.progressWrapper');

        if (progressWrapper === null) {
            return;
        }

        const wrapperStyles = getComputedStyle(progressWrapper);

        this.#width = progressWrapper.clientWidth - parseFloat(wrapperStyles.paddingLeft) - parseFloat(wrapperStyles.paddingRight);
        this.#height = this.#width / 3 * 2;
        this.#chartWidth = this.#width / 100 * 80;
        this.#chartHeight = this.#height / 100 * 80;
        this.#offestX = this.#width / 100 * 10;
        this.#offsetY = this.#height / 100 * 10;

        const pixelRatio = window.devicePixelRatio;

        const canvas = document.createElement('canvas');
        canvas.width = this.#width * pixelRatio;
        canvas.height = this.#height * pixelRatio;
        canvas.style.width = `${this.#width}px`;
        canvas.style.height = `${this.#height}px`;

        progressWrapper.appendChild(canvas);

        this.#canvas = canvas;
        this.#context = canvas.getContext('2d');

        this.#context?.scale(pixelRatio, pixelRatio);

        if (this.#context === null) {
            return;
        }

        this.#context.font = '10px Nunito, Arial, Helvetica, sans-serif';

        shadow
            .querySelector('select')
            ?.addEventListener('change', this.handleTimePeriodChange);

        shadow
            .querySelector('button')
            ?.addEventListener('click', this.toggleMode);

        this.#render();
    }

    /** @param {Event} event  */
    handleTimePeriodChange(event) {
        const target = event.target;

        if (!(target instanceof HTMLSelectElement)) {
            return;
        }

        this.#changeTimePeriod(target.value);
        this.#render();
    }

    toggleMode() {
        this.#isVolumeMode = !this.#isVolumeMode;

        const modeElement = this.shadowRoot?.querySelector('p');

        if (!modeElement) {
            return;
        }

        modeElement.textContent = this.#isVolumeMode ? 'Volumen (Gewicht x Reps)' : 'Gewicht';
        this.#render();
    }

    #render() {
        this.#filteredExerciseHistory = this.#exerciseHistory
            .filter((entry) => {
                const time = entry.Date.getTime();

                return time > this.#timePeriod.startDate.getTime() && time < this.#timePeriod.endDate.getTime();
            });

        this.#highestVolume = this.#exerciseHistory
            .map((datapoint) => datapoint.Reps * datapoint.Weight)
            .sort((a, b) => a - b)
            .pop() ?? 0;

        this.#highestWeight = this.#exerciseHistory
            .toSorted((a, b) => a.Weight - b.Weight)
            .pop()?.Weight ?? 0;

        if (this.#canvas === null) {
            return;
        }

        this.#context?.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
        this.#createXAxis();
        this.#createYAxis();
        this.#createLines();
    }

    /** @param {string} timePeriod  */
    #changeTimePeriod(timePeriod) {
        const now = new Date();
        const endDate = new Date();
        endDate.setHours(0);
        endDate.setMinutes(0);
        endDate.setSeconds(3);
        let startDate;

        switch (timePeriod) {
            case 'year':
                startDate = new Date();
                startDate.setFullYear(now.getFullYear() - 1);
                startDate.setHours(0);
                startDate.setMinutes(0);
                startDate.setSeconds(1);

                this.#timePeriod = {
                    startDate,
                    endDate,
                };

                break;
            case 'all':
                startDate = new Date(this.#exerciseHistory[0].Date);
                startDate.setHours(0);
                startDate.setMinutes(0);
                startDate.setSeconds(1);

                this.#timePeriod = {
                    startDate,
                    endDate,
                };

                break;
            default:
                startDate = new Date();
                startDate.setMonth(now.getMonth() - 1);
                startDate.setHours(0);
                startDate.setMinutes(0);
                startDate.setSeconds(1);

                this.#timePeriod = {
                    startDate,
                    endDate,
                };
        }
    }

    #createXAxis() {
        if (this.#context === null) {
            return;
        }

        this.#context.fillStyle = this.#axisColor;
        this.#context.strokeStyle = this.#axisColor;

        const startY = this.#height / 100 * 90;

        this.#context.beginPath();
        this.#context.moveTo(this.#offestX, startY);

        const endX = this.#offestX + this.#chartWidth;

        this.#context.lineTo(endX, startY);
        this.#context.stroke();

        this.#context.strokeStyle = this.#helperLineColor;

        const middleY = this.#height / 100 * 50;
        this.#context.beginPath();
        this.#context.moveTo(this.#offestX - 5, middleY);
        this.#context.lineTo(endX, middleY);

        this.#context.moveTo(this.#offestX - 5, this.#offsetY);
        this.#context.lineTo(endX, this.#offsetY);
        this.#context.stroke();

        if (this.#isVolumeMode) {
            this.#context.fillText(String(Math.floor(this.#highestVolume / 2)), 0, middleY + 3);
            this.#context.fillText(String(this.#highestVolume), 0, this.#offsetY + 3);
        } else {
            this.#context.fillText(String(Math.floor(this.#highestWeight / 2)), 0, middleY + 3);
            this.#context.fillText(String(this.#highestWeight), 0, this.#offsetY + 3);
        }

        this.#context.fillText(formatDate(this.#timePeriod.startDate), 0, startY + 12);
        this.#context.fillText(formatDate(this.#timePeriod.endDate), endX - 25, startY + 12);
    }

    #createYAxis() {
        if (this.#context === null) {
            return;
        }

        this.#context.strokeStyle = this.#axisColor;
        this.#context.fillStyle = this.#axisColor;

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

        const coordinates = this.#filteredExerciseHistory.map((datapoint) => this.#getDatapointCoordinates(datapoint));

        this.#context.strokeStyle = this.#lineColor;
        this.#context.beginPath();
        coordinates.forEach(({ x, y }) => {
            this.#context?.lineTo(x, y);
        });
        this.#context.stroke();

        this.#context.fillStyle = this.#lineColor;
        this.#context.beginPath();
        coordinates.forEach(({ x, y }) => {
            this.#context?.moveTo(x, y);
            this.#context?.arc(x, y, 4, 0, Math.PI * 2, true);
        });
        this.#context.fill();
    }

    /** @param {ExerciseHistoryEntry} datapoint  */
    #getDatapointCoordinates(datapoint) {
        const startTime = this.#timePeriod.startDate.getTime();
        const totalTime = this.#timePeriod.endDate.getTime() - startTime;
        const yTimeDifference = datapoint.Date.getTime() - startTime;
        const x = this.#chartWidth / totalTime * yTimeDifference + this.#offestX;

        let y;
        if (this.#isVolumeMode) {
            y = this.#chartHeight - this.#chartHeight / this.#highestVolume * datapoint.Reps * datapoint.Weight + this.#offsetY;
        } else {
            y = this.#chartHeight - this.#chartHeight / this.#highestWeight * datapoint.Weight + this.#offsetY;
        }

        return { x, y };
    }
}

customElements.define('fit-progress-chart', ProgressChart);