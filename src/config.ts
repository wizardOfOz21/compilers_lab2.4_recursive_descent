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
    return new RegExp(`(?<CONTROL_SYMBOL_ALPHABETIC>\\$(${controls})\\$)`);
}

function getKeyWords(keyWords: {[key: string]: string}): LexemList {
    const lexemList: LexemList = {};
    for (const key in keyWords) {
        lexemList[key] = new RegExp(`(?<${key}>${keyWords[key]}\\b)`);
    }
    return lexemList;
}

function getNumbers() {
    const template = (base: number, name: string) => {
        if (base < 11) {
            const symbol = `[0-${base-1}]`;
            return `(?<${name}>${symbol}${symbol}*\\{${base}\\})`;
        }
        const lastCharUpper = String.fromCharCode(54 + base);
        const lastCharLower = lastCharUpper.toLowerCase();
        const symbol = `[0-9a-${lastCharLower}A-${lastCharUpper}]`;
        return `(?<${name}>${symbol}${symbol}*\\{${base}\\})`;
    }
    const lexemList: LexemList = {};
    for (let i = 2; i < 37; i++) {
        const name = `NUMBER_${i}`;
        lexemList[name] = new RegExp(template(i, name));
    }
    lexemList.NUMBER = new RegExp(`(?<NUMBER>[0-9][0-9]*)`);
    return lexemList;
}

export const lexemList: LexemList = {
    NEWLINE: /(?<NEWLINE>\n)/,
    NEWLINE_R: /(?<NEWLINE_R>\r\n)/,
    SPACE: /(?<SPACE>[^\S\r\n]+)/,
    ...getKeyWords(keyWords),
    IDENT: /(?<IDENT>(_|!|@|\.|#)\p{L}\w*)/,
    SYMBOL_QUOTE: /(?<SYMBOL_QUOTE>"""")/,
    SYMBOL: /(?<SYMBOL>"[^\p{Cc}]")/,
    CONTROL_SYMBOL_NUMERIC: /(?<CONTROL_SYMBOL_NUMERIC>\$([0-9]|[0-2][0-9]|30|31)\$)/,
    CONTROL_SYMBOL_ALPHABETIC: getControlsRegex(),
    ...getNumbers(),
};

console.log(lexemList);