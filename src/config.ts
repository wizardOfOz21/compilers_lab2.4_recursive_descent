import { LexemList } from "./Lexer";

const match = (str: string, regex: RegExp) => str.match(regex);

export const specialValues = ['NIL']

function getSpecialValues(values) {
    const lexemList: LexemList = {};
    for (const value of values) {
        lexemList[value] = new RegExp(`${value}\\b`);
    }
    return lexemList;
}

const lexemDefinition = {
    ...getSpecialValues(specialValues),
    IDENTIFIER: /\p{L}\w*/,
    UNSIGNED_NUMBER: /[0-9]+(\.[0-9]+)?([eE][-+]?[0-9]+)?/,
    STRING: /'[^\p{Cc}]*?'/,

    NEWLINE: /\n/,
    NEWLINE_R: /\r\n/,
    SPACE: /[^\S\r\n]+/,
};

export const lexemList: LexemList = (() => {
    const lexemList: LexemList = {};
    for (const lexem in lexemDefinition) {
        lexemList[lexem] = new RegExp(`(?<${lexem}>${lexemDefinition[lexem].source})`);
    }
    return lexemList;
})();

console.log(lexemList);