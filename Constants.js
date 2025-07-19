export const databaseName = 'trainingsplan';

export const globalObjectStoreNames = {
    globalExercises: 'globalExercises',
};
Object.freeze(globalObjectStoreNames);

export const objectStoreNames = {
    userExercises: 'userExercises',
    userWorkouts: 'userWorkouts',
    userPlans: 'userPlans',
    workoutHistory: 'workoutHistory',
    exerciseHistory: 'exerciseHistory',
};
Object.freeze(objectStoreNames);

export const customEventNames = {
    moveUp: 'moveUp',
    moveDown: 'moveDown',
    remove: 'remove',
};
Object.freeze(customEventNames);

export const workoutHistoryIndexes = {
    workoutId: 'WorkoutId',
};
Object.freeze(workoutHistoryIndexes);

export const exerciseHistoryIndexes = {
    exerciseId: 'ExerciseId',
};
Object.freeze(exerciseHistoryIndexes);

export const globalClassNames = {
    pageContainer: 'pageContainer',
    headerContainer: 'headerContainer',
    inputWrapper: 'inputWrapper',
};
Object.freeze(globalClassNames);


export const buttonVariantClassNames = {
    outlined: 'outlined',
};
Object.freeze(buttonVariantClassNames);

export const buttonSizeClassNames = {
    icon: 'icon',
    textAndIcon: 'textAndIcon',
};
Object.freeze(buttonSizeClassNames);