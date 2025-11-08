const CACHE_VERSION = 'v11';

const ASSETS = [
    '/favicon.ico',
    '/components/AppRouterLink.js',
    '/components/ExerciseSelect.js',
    '/components/Icon.js',
    '/components/NavTabs.js',
    '/components/RandomGenderWorkoutEmoji.js',
    '/lib/ClientRouter.js',
    '/lib/DateHelpers.js',
    '/lib/Observable.js',
    '/lib/PromiseIndexedDB.js',
    '/lib/TrainingDataParser.js',
    '/models/Exercise.js',
    '/models/ExerciseResponse.js',
    '/models/Observer.js',
    '/models/Route.js',
    '/models/TrainingData.js',
    '/models/Workout.js',
    '/pages/exercises/edit/Page.js',
    '/pages/exercises/history/Page.js',
    '/pages/exercises/Page.js',
    '/pages/settings/components/ExportButton.js',
    '/pages/settings/components/ImportButton.js',
    '/pages/settings/Page.js',
    '/pages/workouts/components/EditExerciseCard.js',
    '/pages/workouts/components/ExerciseSet.js',
    '/pages/workouts/components/StartExerciseCard.js',
    '/pages/workouts/edit/Page.js',
    '/pages/workouts/history/Page.js',
    '/pages/workouts/start/Page.js',
    '/pages/workouts/start/Page.css',
    '/pages/workouts/Page.js',
    '/services/ExercisesService.js',
    '/services/WorkoutsService.js',
    '/store/WorkoutsStartStore.js',
    '/App.js',
    '/Constants.js',
    '/globals.css',
    '/index.html',
    '/Nunito-VariableFont_wght.ttf',
    '/Routes.js',
];

const ROUTES = [
    '',
    '/',
    '/workouts',
    '/workouts/neu',
    '/workouts/beendet',
    '/workouts/?/bearbeiten',
    '/workouts/?/starten',
    '/uebungen',
    '/uebungen/neu',
    '/uebungen/?',
    '/uebungen/?/fortschritt',
    '/einstellungen',
];

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

    const url = new URL(request.url);
    const urlParts = url.pathname.split('/');

    const isRoute = ROUTES.some((asset) => {
        const assetParts = asset.split('/');

        return assetParts.every((assetPart, i) => assetPart === '?' || assetPart === urlParts[i]);
    });

    if (isRoute) {
        const indexResponse = await caches.match('/index.html');

        if (indexResponse) {
            return indexResponse;
        }
    }

    const responseFromNetwork = await fetch(request);
    const isInAssets = ASSETS.some((asset) => asset === url.pathname);

    if (isInAssets) {
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
        addResourcesToCache(ASSETS)
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
    event.respondWith(cacheFirst(event.request));
});