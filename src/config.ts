import { LexemList } from "./Lexer";

const match = (str: string, regex: RegExp) => str.match(regex);

const keyWords: {[key: string]: string} = {
    AND: "_and_",
}

export const controlSymbols = {
    NUL: 0,
    SOH: 1,
}

function resolveControlSymbol(symbol: string): number {
    return controlSymbols[symbol];
}

function getControlsRegex() {
    const controls = Object.keys(controlSymbols).join('|');
    return new RegExp(`\\$(${controls})\\$`);
}

function getKeyWords(keyWords: {[key: string]: string}): LexemList {
    const lexemList: LexemList = {};
    for (const key in keyWords) {
        lexemList[key] = new RegExp(`${keyWords[key]}\\b`);
    }
    return lexemList;
}

const lexemDefinition = {
    IDENTIFIER: /\p{L}\w*/,
    UNSIGNED_NUMBER: /[0-9]+(\.[0-9]+)?([eE][-+]?[0-9]+)?/,

    NEWLINE: /\n/,
    NEWLINE_R: /\r\n/,
    SPACE: /[^\S\r\n]+/,
    ...getKeyWords(keyWords),
    SYMBOL_QUOTE: /""""/,
    SYMBOL: /"[^\p{Cc}]"/,
    CONTROL_SYMBOL_NUMERIC: /\$([0-9]|[0-2][0-9]|30|31)\$/,
    CONTROL_SYMBOL_ALPHABETIC: getControlsRegex(),
};

export const lexemList: LexemList = (() => {
    const lexemList: LexemList = {};
    for (const lexem in lexemDefinition) {
        lexemList[lexem] = new RegExp(`(?<${lexem}>${lexemDefinition[lexem].source})`);
    }
    return lexemList;
})();

console.log(lexemList);