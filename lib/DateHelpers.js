/** @param {Date} date  */
export function formatDate(date) {
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

/** 
 * @param {Date} firstDate  
 * @param {Date} secondDate 
 * */
export function isSameDay(firstDate, secondDate) {
    return firstDate.getDate() === secondDate.getDate()
        && firstDate.getMonth() === secondDate.getMonth()
        && firstDate.getFullYear() === secondDate.getFullYear();
}

/** 
 * @param {Date} firstDate  
 * @param {Date} secondDate 
 * */
export function compareDate(firstDate, secondDate) {
    if (firstDate < secondDate) {
        return -1;
    }

    if (firstDate > secondDate) {
        return 1;
    }

    return 0;
}

export function getTimeDifference() { }

/** @param {Date} date  */
export function getTimeDifferenceFromNow(date) {
    const elapsedTime = Date.now() - date.getTime();

    const roundedHours = Math.floor(elapsedTime / 1000 / 60 / 60);
    const roundedHoursInMilliseconds = roundedHours * 1000 * 60 * 60;
    const hoursRemainingTime = elapsedTime - roundedHoursInMilliseconds;

    const roundedMinutes = Math.floor(hoursRemainingTime / 1000 / 60);
    const roundedMinutesInMilliseconds = roundedMinutes * 1000 * 60;
    const minutesRemainingTime = hoursRemainingTime - roundedMinutesInMilliseconds;

    const roundedSeconds = Math.floor(minutesRemainingTime / 1000);

    return `${roundedHours < 10 ? 0 : ''}${roundedHours}:${roundedMinutes < 10 ? 0 : ''}${roundedMinutes}:${roundedSeconds < 10 ? 0 : ''}${roundedSeconds}`;
}