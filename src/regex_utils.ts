export const match = (str: string, regex: RegExp) => str.match(regex);

export interface RegexpMap {
    [key: string]: RegExp;
}

export function addGroup(regexp: RegExp, group: string): RegExp {
    return new RegExp(`(?<${group}>${regexp.source})`);
}

export function addGroups(map: RegexpMap): RegexpMap {
    const transformed: RegexpMap = {};
    for (const key in map) {
        transformed[key] = addGroup(map[key], key);
    }
    return transformed;
}

export function alternativeCombine(map: RegexpMap, flags?: string): RegExp {
    const source: string = Object.values(map).reduce(
        (prev, current: RegExp) => prev + "|" + current.source,
        ""
    ) as string;
    return new RegExp(`^(${source.slice(1)})`, flags);
}

export function arrayToRegexMap(values: string[]) {
    const lexemList: RegexpMap = {};
    for (const value of values) {
        lexemList[value] = new RegExp(`${value}\\b`);
    }
    return lexemList;
}

export function objectToRegexMap(values: { [key: string]: string }) {
    const lexemList: RegexpMap = {};
    for (const value in values) {
        lexemList[value] = new RegExp(`${value}\\b`);
        // lexemList[value] = new RegExp(`${values[value]}\\b`);
    }
    return lexemList;
}