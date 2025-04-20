import { databaseName, objectStoreNames } from '../Constants.js';

export class PromiseIndexedDB {
    /** @type {IDBDatabase} */
    #database;

    /** @return {Promise<void>} */
    initialize() {
        return new Promise((resolve) => {
            const request = window.indexedDB.open(databaseName, 1);

            request.onupgradeneeded = (event) => {
                /** @type {IDBDatabase} */
                const database = event.target.result;
                database.createObjectStore(objectStoreNames.exercises, { keyPath: 'ID' });
            };

            request.onsuccess = (event) => {
                this.#database = event.target.result;
                resolve();
            }
        });
    }

    /** 
     * @template T
     * @param {string} objectStoreName
     * @param {T} entry
     * @return {Promise<void>}
     */
    put(objectStoreName, entry) {
        return new Promise((resolve) => {
            const request = this.#database
                .transaction([objectStoreName], 'readwrite')
                .objectStore(objectStoreName)
                .put(entry);

            request.onsuccess = () => {
                resolve();
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
}

export const promiseIndexedDB = new PromiseIndexedDB;