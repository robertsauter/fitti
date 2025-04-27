import { ClientRouter } from '/lib/ClientRouter.js';
import '/models/Route.js';

export const appRouterIds = {
    home: 'home',
    login: 'login',
    register: 'register',
    plans: 'plans',
    workouts: 'workouts',
    exercises: 'exercises',
    exercisesAdd: 'exercisesAdd',
    exercisesEdit: 'exercisesEdit'
};
Object.freeze(appRouterIds);

/** @type {Route[]} */
const routes = [
    {
        id: appRouterIds.home,
        path: '/',
        component: '<fit-home-page></fit-home-page>',
        importPath: '/pages/home/Page.js',
    },
    {
        id: appRouterIds.plans,
        path: '/plaene',
        component: '<fit-plans-page></fit-plans-page>',
        importPath: '/pages/plans/Page.js',
    },
    {
        id: appRouterIds.workouts,
        path: '/workouts',
        component: '<fit-workouts-page></fit-workouts-page>',
        importPath: '/pages/workouts/Page.js',
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
        component: '<fit-exercises-add-page></fit-exercises-add-page>',
        importPath: '/pages/exercises/add/Page.js',
    },
    {
        id: appRouterIds.exercisesEdit,
        path: '/uebungen/:id',
        component: '<fit-exercises-edit-page></fit-exercises-edit-page>',
        importPath: '/pages/exercises/edit/Page.js',
    },
];

export const appRouter = new ClientRouter(routes);