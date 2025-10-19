const CACHE_VERSION = 'v6';

/** @param {string[]} resources  */
async function addResourcesToCache(resources) {
    const cache = await caches.open(CACHE_VERSION);
    await cache.addAll(resources);
}

/** @param {Request} request  */
async function cacheFirst(request) {
    const responseFromCache = await caches.match(request);

    if (responseFromCache) {
        return responseFromCache;
    }

    const responseFromNetwork = await fetch(request);
    const url = new URL(request.url);

    if (url.origin === location.origin) {
        putInCache(request, responseFromNetwork.clone());
    }

    return responseFromNetwork;
}

/**
 * @param {Request} request 
 * @param {Response} response 
 */
async function putInCache(request, response) {
    const cache = await caches.open(CACHE_VERSION);
    await cache.put(request, response);
}

/** @param {string} key  */
async function deleteCache(key) {
    await caches.delete(key);
}

async function deleteOldCaches() {
    const keyList = await caches.keys();
    const cachesToDelete = keyList.filter((key) => key !== CACHE_VERSION);
    await Promise.all(cachesToDelete.map(deleteCache));
}

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
    event.respondWith(cacheFirst(event.request));
});