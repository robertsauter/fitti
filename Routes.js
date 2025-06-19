import { ClientRouter } from '/lib/ClientRouter.js';
import '/models/Route.js';

export const appRouterIds = {
    workouts: 'workouts',
    workoutsAdd: 'workoutsAdd',
    workoutsEdit: 'workoutsEdit',
    workoutsStart: 'workoutsStart',
    workoutsHistory: 'workoutsHistory',
    exercises: 'exercises',
    exercisesAdd: 'exercisesAdd',
    exercisesEdit: 'exercisesEdit',
    exerciseHistory: 'exerciseHistory',
};
Object.freeze(appRouterIds);

/** @type {Route[]} */
const routes = [
    {
        id: appRouterIds.workouts,
        path: '/workouts',
        component: '<fit-workouts-page></fit-workouts-page>',
        importPath: '/pages/workouts/Page.js',
    },
    {
        id: appRouterIds.workoutsAdd,
        path: '/workouts/neu',
        component: '<fit-workouts-edit-page></fit-workouts-edit-page>',
        importPath: '/pages/workouts/edit/Page.js',
    },
    {
        id: appRouterIds.workoutsHistory,
        path: '/workouts/beendet',
        component: '<fit-workouts-history-page></fit-workouts-history-page>',
        importPath: '/pages/workouts/history/Page.js',
    },
    {
        id: appRouterIds.workoutsEdit,
        path: '/workouts/:id/bearbeiten',
        component: '<fit-workouts-edit-page></fit-workouts-edit-page>',
        importPath: '/pages/workouts/edit/Page.js',
    },
    {
        id: appRouterIds.workoutsStart,
        path: '/workouts/:id/starten',
        component: '<fit-workouts-start-page></fit-workouts-start-page>',
        importPath: '/pages/workouts/start/Page.js',
    },
    {
        id: appRouterIds.exercises,
        path: '/uebungen',
        component: '<fit-exercises-page></fit-exercises-page>',
        importPath: '/pages/exercises/Page.js',
    },
    {
        id: appRouterIds.exercisesAdd,
        path: '/uebungen/neu',
        component: '<fit-exercises-edit-page></fit-exercises-edit-page>',
        importPath: '/pages/exercises/edit/Page.js',
    },
    {
        id: appRouterIds.exercisesEdit,
        path: '/uebungen/:id',
        component: '<fit-exercises-edit-page></fit-exercises-edit-page>',
        importPath: '/pages/exercises/edit/Page.js',
    },
    {
        id: appRouterIds.exerciseHistory,
        path: '/uebungen/:id/fortschritt',
        component: '<fit-exercise-history-page></fit-exercise-history-page>',
        importPath: '/pages/exercises/history/Page.js',
    },
];

export const appRouter = new ClientRouter(routes);