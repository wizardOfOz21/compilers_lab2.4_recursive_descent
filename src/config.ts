import { LexemList } from "./Lexer";

function getKeyWords(values: string[]) {
    const lexemList: LexemList = {};
    for (const value of values) {
        lexemList[value] = new RegExp(`${value}\\b`);
    }
    return lexemList;
}

function getNamedSpecialValues(values: { [key: string]: string }) {
    const lexemList: LexemList = {};
    for (const value in values) {
        lexemList[value] = new RegExp(`${value}\\b`);
    }
    return lexemList;
}

// Лексическая структура языка:
// - Лексические домены заданы регулярными выражениями
// - Приоритет доменов задан порядком их вхождения в объект lexemDefinition
// - Каждое ключевое слово принадлежит отдельному домену
// - Для keyWords название домена совпадает с ключевым словом, для объявления используется рефлексия
// - namedSpecialValues – именованные символьные лексемы

export const keyWords = [
    "NIL",
    "PACKED",
    "OF",
    "ARRAY",
    "FILE",
    "SET",
    "RECORD",
    "END",
    "TYPE",
    "VAR",
    "CASE"
];

export const namedSpecialValues = {
    LPAREN: "(",
    RPAREN: ")",
    COMMA: ",",
    POINTS: "..",
    CARET: "^",
    PLUS: "+",
    MINUS: "-",
    LBRACKET: "[",
    RBRACKET: "]",
    EQUAL: "=",
    COLON: ":",
    SEMICOLON: ";",
    POINT: ".",
};

const lexemDefinition = {
    ...getNamedSpecialValues(namedSpecialValues),
    ...getKeyWords(keyWords),
    IDENTIFIER: /\p{L}\w*/u,
    UNSIGNED_NUMBER: /[0-9]+(\.[0-9]+)?([eE][-+]?[0-9]+)?/,
    STRING: /'[^\p{Cc}]*?'/u,

    NEWLINE: /\n/,
    NEWLINE_R: /\r\n/,
    SPACE: /[^\S\r\n]+/,
};

export const lexemList: LexemList = (() => {
    const lexemList: LexemList = {};
    for (const lexem in lexemDefinition) {
        lexemList[lexem] = new RegExp(
            `(?<${lexem}>${lexemDefinition[lexem].source})`
        );
    }
    return lexemList;
})();

console.log(lexemList);
