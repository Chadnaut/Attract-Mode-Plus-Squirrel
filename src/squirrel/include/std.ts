// STD implementations
// NOTE: Does not check alpha against current locale

// Checks if the given wide character corresponds (if narrowed) to one of the ten decimal digit characters 0123456789.
export const iswdigit = (c: string | undefined): boolean => {
    if (c === undefined) return false;
    const code = c.charCodeAt(0);
    return code > 47 && code < 58; // numeric 0-9
};

// Checks if the given wide character corresponds (if narrowed) to a hexadecimal numeric character, i.e. one of 0123456789abcdefABCDEF.
export const iswxdigit = (c: string | undefined): boolean => {
    if (c === undefined) return false;
    const code = c.charCodeAt(0);
    return (
        (code > 47 && code < 58) || // numeric 0-9
        (code > 96 && code < 103) || // lower a-f
        (code > 64 && code < 71) // upper A-F
    );
};

// Checks if the given wide character is an alphabetic character, i.e. either an uppercase letter (ABCDEFGHIJKLMNOPQRSTUVWXYZ), a lowercase letter (abcdefghijklmnopqrstuvwxyz) or any alphabetic character specific to the current locale.
export const iswalpha = (c: string | undefined): boolean => {
    if (c === undefined) return false;
    const code = c.charCodeAt(0);
    return (
        (code > 64 && code < 91) || // upper A-Z
        (code > 96 && code < 123) // lower a-z
    );
};

// Checks if the given wide character is a control character, i.e. codes 0x00-0x1F and 0x7F and any control characters specific to the current locale.
export const iswcntrl = (c: string | undefined): boolean => {
    if (c === undefined) return false;
    const code = c.charCodeAt(0);
    return (code > -1 && code < 32) || code === 127;
};

// Checks if the given wide character is an alphanumeric character, i.e. either a number (0123456789), an uppercase letter (ABCDEFGHIJKLMNOPQRSTUVWXYZ), a lowercase letter (abcdefghijklmnopqrstuvwxyz) or any alphanumeric character specific to the current locale.
export const iswalnum = (c: string | undefined): boolean => {
    if (c === undefined) return false;
    const code = c.charCodeAt(0);
    return (
        (code > 47 && code < 58) || // numeric 0-9
        (code > 64 && code < 91) || // upper A-Z
        (code > 96 && code < 123) // lower a-z
    );
};

// Interprets a floating-point value in a wide string pointed to by str
export const wcstod = (str: string): number => {
    return parseFloat(str);
}
