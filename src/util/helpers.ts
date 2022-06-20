/**
 * Gets a random element in array
 * @param {Array} array items An array containing the items.
 */
export function getRanElement(array: any[]) {
    return array[Math.floor(Math.random() * array.length)]
}

/**
 * Shuffles array in place.
 * source: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array/6274381#6274381
 * @param {Array} a items An array containing the items.
 */
export function shuffle(a: any[]) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}