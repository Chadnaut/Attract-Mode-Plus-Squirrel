/** Filter for unique array */
export const uniqueFilter = (v: unknown, i: number, a: unknown[]): boolean =>
    a.indexOf(v) === i;
