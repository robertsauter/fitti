import { databaseName, exerciseHistoryIndexes, objectStoreNames, workoutHistoryIndexes } from '/Constants.js';
import { indexedDBManager } from '/lib/IndexedDBManager.js';
import '/models/Updater.js';
import '/models/Pagination.js';

export class PromiseIndexedDB {
    /** @type {IDBDatabase | undefined} */
    #database;

    /** @return {Promise<void>} */
    initialize() {
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open(databaseName, indexedDBManager.version);

            request.onupgradeneeded = (event) => {
                if (!(event.target instanceof IDBOpenDBRequest)) {
                    reject();
                    return;
                }

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
            };

            request.onsuccess = (event) => {
                if (!(event.target instanceof IDBOpenDBRequest)) {
                    reject();
                    return;
                }

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
            if (this.#database === undefined) {
                reject();
                return;
            }

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
    * @param {number | string} id
    * @param {string} objectStoreName
    * @return {Promise<T | undefined>}
    */
    get(objectStoreName, id) {
        return new Promise((resolve, reject) => {
            if (this.#database === undefined) {
                reject();
                return;
            }

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
            if (this.#database === undefined) {
                reject();
                return;
            }

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
            if (this.#database === undefined) {
                reject();
                return;
            }

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
            if (this.#database === undefined) {
                reject();
                return;
            }

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
            if (this.#database === undefined) {
                reject();
                return;
            }

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

    /** 
    * @param {number} [id]
    * @param {string} objectStoreName
    * @return {Promise<number>}
    */
    count(objectStoreName, id) {
        return new Promise((resolve, reject) => {
            if (this.#database === undefined) {
                reject();
                return;
            }

            const request = this.#database
                .transaction([objectStoreName], 'readonly')
                .objectStore(objectStoreName)
                .count(id);

            request.onsuccess = () => {
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
     * @returns {Promise<undefined>}
     */
    clear(objectStoreName) {
        return new Promise((resolve, reject) => {
            if (this.#database === undefined) {
                reject();
                return;
            }

            const request = this.#database
                .transaction([objectStoreName], 'readwrite')
                .objectStore(objectStoreName)
                .clear();

            request.onsuccess = () => {
                const result = request.result;
                resolve(result);
            };

            request.onerror = () => {
                reject();
            };
        });
    }

    /** 
     * @template TInput
     * @template TOutput
     * @param {string} objectStoreName
     * @param {Updater<TInput, TOutput>} update 
     * @returns {Promise<void>}
     */
    updateAll(objectStoreName, update) {
        return new Promise((resolve, reject) => {
            if (this.#database === undefined) {
                reject();
                return;
            }

            const request = this.#database
                .transaction([objectStoreName], 'readwrite')
                .objectStore(objectStoreName)
                .openCursor();

            request.onsuccess = (event) => {
                const cursor = event.target?.result;

                if (!cursor) {
                    resolve();
                    return;
                }

                if (!(cursor instanceof IDBCursorWithValue)) {
                    reject();
                    return;
                }

                cursor.update(update(cursor.value));
                cursor.continue();
            };

            request.onerror = () => {
                reject();
            };
        });
    }

    /**
     * @template T
     * @param {string} objectStoreName 
     * @param {PaginationOptions} options 
     * @param {boolean} [isAscending] 
     * @returns {Promise<PaginatedList<T>>}
     */
    async getPaginated(objectStoreName, options, isAscending) {
        /** @type {Promise<T[]>} */
        const itemsPromise = new Promise((resolve, reject) => {
            if (this.#database === undefined) {
                reject();
                return;
            }

            const request = this.#database
                .transaction([objectStoreName], 'readonly')
                .objectStore(objectStoreName)
                .openCursor(null, isAscending ? 'prev' : 'next');

            /** @type {T[]} */
            const foundItems = [];
            const startIndex = options.pageSize * options.currentPage;
            const endIndex = startIndex + options.pageSize - 1;
            let index = 0;

            request.onsuccess = (event) => {
                const cursor = event.target?.result;

                if (!cursor) {
                    resolve(foundItems);
                    return;
                }

                if (!(cursor instanceof IDBCursorWithValue)) {
                    reject();
                    return;
                }

                if (index >= startIndex && index <= endIndex) {
                    foundItems.push(cursor.value);
                }

                index += 1;
                cursor.continue();
            };

            request.onerror = () => {
                reject();
            };
        });

        const totalItemsCountPromise = this.count(objectStoreName);

        const [items, totalItemsCount] = await Promise.all([itemsPromise, totalItemsCountPromise]);

        const pagesCount = Math.ceil(totalItemsCount / options.pageSize);

        return {
            items,
            pagination: {
                currentPage: options.currentPage,
                pagesCount: pagesCount,
                pageSize: options.pageSize,
                totalItemsCount,
            },
        };
    }
}

export const promiseIndexedDB = new PromiseIndexedDB();