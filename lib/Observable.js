import '/models/Observer.js';

/** @template T */
export class Observable {
    /** @type {Observer<T>[]} */
    #observers = [];

    /** @param {Observer<T>} observer  */
    addObserver(observer) {
        this.#observers.push(observer);
    }

    /** @param {T} value  */
    emit(value) {
        this.#observers.forEach((observer) => {
            observer(value);
        })
    }
}