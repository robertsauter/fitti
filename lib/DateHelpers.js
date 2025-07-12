/** @param {Date} date  */
export function formatDate(date) {
    return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
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