import * as unicode from "unicode-properties";

export const isMatch = (str, regex) => {
    if (str == EOF) return false;
    return !!str.match(regex);
}
export const codePoint = (str) => str.codePointAt(0);
export const category = (str) => unicode.getCategory(codePoint(str));
export const objectCopy = (obj) => Object.assign({}, obj);
export const unicodeChar = (str) => String.fromCodePoint(codePoint(str));

export type char = string | -1;

export const EOF: char = -1;
export const NOT_ASSIGNED_CATEGORY = "Cn";
