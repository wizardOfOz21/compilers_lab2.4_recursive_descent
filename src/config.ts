import { LexemMap } from "./lexer";
import { arrayToRegexMap, objectToRegexMap } from "./regex_utils";

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

// [ ] { } ( ) \ ^ $ . | ? * +
export const namedSpecialValues = {
    LPAREN: "\\(",
    RPAREN: "\\)",
    COMMA: ",",
    POINTS: "\\.\\.",
    CARET: "\\^",
    PLUS: "\\+",
    MINUS: "-",
    LBRACKET: "\\[",
    RBRACKET: "\\]",
    EQUAL: "=",
    COLON: ":",
    SEMICOLON: ";",
};

export const lexemDefinition: LexemMap = {
    ...objectToRegexMap(namedSpecialValues),
    ...arrayToRegexMap(keyWords),
    IDENTIFIER: /\p{L}\w*/u,
    UNSIGNED_NUMBER: /[0-9]+(\.[0-9]+)?([eE][-+]?[0-9]+)?/,
    STRING: /'[^\p{Cc}]*?'/u,
    
    COMMENT: /\{[^}]*\}/u,
    NEWLINE: /\n/,
    NEWLINE_R: /\r\n/,
    SPACE: /[^\S\r\n]+/,
};
