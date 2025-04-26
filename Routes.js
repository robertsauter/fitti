import { ClientRouter } from './lib/ClientRouter.js';
import { HomePage } from './pages/home/Page.js';
import { PlansPage } from './pages/plans/Page.js';
import { WorkoutsPage } from './pages/workouts/Page.js';
import { ExercisesPage } from './pages/exercises/Page.js';
import { ExercisesAddPage } from './pages/exercises/add/Page.js';
import './models/Route.js';

export const appRouterIds = {
    home: 'home',
    login: 'login',
    register: 'register',
    plans: 'plans',
    workouts: 'workouts',
    exercises: 'exercises',
    exercisesAdd: 'exercisesAdd'
};
Object.freeze(appRouterIds);

/** @type {Route[]} */
const routes = [
    {
        id: appRouterIds.home,
        path: '/',
        component: '<fit-home-page></fit-home-page>',
    },
    {
        id: appRouterIds.plans,
        path: '/plaene',
        component: '<fit-plans-page></fit-plans-page>',
    },
    {
        id: appRouterIds.workouts,
        path: '/workouts',
        component: '<fit-workouts-page></fit-workouts-page>',
    },
    {
        id: appRouterIds.exercises,
        path: '/uebungen',
        component: '<fit-exercises-page></fit-exercises-page>',
    },
    {
        id: appRouterIds.exercisesAdd,
        path: '/uebungen/neu',
        component: '<fit-exercises-add-page></fit-exercises-add-page>',
    },
];

export const appRouter = new ClientRouter(routes);