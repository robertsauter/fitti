import { databaseName, exerciseHistoryIndexes, globalObjectStoreNames, objectStoreNames, workoutHistoryIndexes } from '/Constants.js';

export class PromiseIndexedDB {
    /** @type {IDBDatabase} */
    #database;

    /** @return {Promise<void>} */
    initialize() {
        return new Promise((resolve) => {
            const request = window.indexedDB.open(databaseName, 18);

            request.onupgradeneeded = (event) => {
                /** @type {IDBDatabase} */
                const database = event.target.result;

                Object.values(objectStoreNames).forEach((name) => {
                    if (database.objectStoreNames.contains(name)) {
                        return;
                    }

                    const objectStore = database.createObjectStore(name, { keyPath: 'ID', autoIncrement: true });

                    if (name === objectStoreNames.workoutHistory) {
                        objectStore.createIndex(workoutHistoryIndexes.workoutId, workoutHistoryIndexes.workoutId);
                    }

                    if (name === objectStoreNames.exerciseHistory) {
                        objectStore.createIndex(exerciseHistoryIndexes.exerciseId, exerciseHistoryIndexes.exerciseId, { unique: true });
                    }
                });

                Object.values(globalObjectStoreNames).forEach((name) => {
                    if (!database.objectStoreNames.contains(name)) {
                        database.createObjectStore(name, { keyPath: 'ID', autoIncrement: false });
                    }
                });
            };

            request.onsuccess = (event) => {
                this.#database = event.target.result;
                resolve();
            };
        });
    }

    /** 
     * @template T
     * @param {string} objectStoreName
     * @param {T} entry
     * @return {Promise<void>}
     */
    put(objectStoreName, entry) {
        return new Promise((resolve, reject) => {
            const request = this.#database
                .transaction([objectStoreName], 'readwrite')
                .objectStore(objectStoreName)
                .put(entry);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject();
            };
        });
    }

    /** 
    * @template T
    * @param {string} objectStoreName
    * @param {T[]} entries
    */
    putAll(objectStoreName, entries) {
        return Promise.all(entries.map((entry) => this.put(objectStoreName, entry)));
    }

    /** 
    * @template T
    * @param {number} id
    * @param {string} objectStoreName
    * @return {Promise<T>}
    */
    get(objectStoreName, id) {
        return new Promise((resolve, reject) => {
            const request = this.#database
                .transaction([objectStoreName], 'readonly')
                .objectStore(objectStoreName)
                .get(id);

            request.onsuccess = () => {
                /** @type {T} */
                const result = request.result;
                resolve(result);
            };

            request.onerror = () => {
                reject();
            };
        });
    }

    /** 
    * @template T
    * @param {string} objectStoreName
    * @param {string} indexName 
    * @param {string | number} indexValue 
    * @return {Promise<T>}
    */
    getByIndex(objectStoreName, indexName, indexValue) {
        return new Promise((resolve, reject) => {
            const request = this.#database
                .transaction([objectStoreName], 'readonly')
                .objectStore(objectStoreName)
                .index(indexName)
                .get(indexValue);

            request.onsuccess = () => {
                /** @type {T} */
                const result = request.result;
                resolve(result);
            };

            request.onerror = () => {
                reject();
            };
        });
    }

    /** 
    * @template T
    * @param {string} objectStoreName
    * @return {Promise<T[]>}
    */
    getAll(objectStoreName) {
        return new Promise((resolve, reject) => {
            const request = this.#database
                .transaction([objectStoreName], 'readonly')
                .objectStore(objectStoreName)
                .getAll();

            request.onsuccess = () => {
                /** @type {T[]} */
                const result = request.result;
                resolve(result);
            };

            request.onerror = () => {
                reject();
            };
        });
    }

    /** 
     * @param {string} objectStoreName 
     * @param {any} value  
     * @returns {Promise<void>}
     * */
    add(objectStoreName, value) {
        return new Promise((resolve, reject) => {
            const request = this.#database
                .transaction([objectStoreName], 'readwrite')
                .objectStore(objectStoreName)
                .add(value);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject();
            };
        });
    }

    /** 
     * @param {string} objectStoreName 
     * @param {number} id
     * @returns {Promise<void>}
     */
    delete(objectStoreName, id) {
        return new Promise((resolve, reject) => {
            const request = this.#database
                .transaction([objectStoreName], 'readwrite')
                .objectStore(objectStoreName)
                .delete(id);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject();
            };
        });
    }
}

export const promiseIndexedDB = new PromiseIndexedDB;