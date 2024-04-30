import { controlSymbols, lexemDefinition, keyWords } from "./config";
import Lexer, { Token } from "./lexer";

test("Идентификатор распознается", () => {
    const data = "testCounter1";
    let lexer = new Lexer(data, lexemDefinition);
    let lexem = lexer.parse();
    expect(lexem.toString()).toMatchSnapshot();
});

test("Целые беззнаковые числа распознаются", () => {
    const data = "011010 123 456 1 0";
    let lexer = new Lexer(data, lexemDefinition);
    let token = lexer.parse();
    while (!token.isEof()) {
        expect(token.toString()).toMatchSnapshot();
        token = lexer.parse();
    }
});

test("Числа с плавающей точкой распознаются", () => {
    const data = "1E+11 42E-11 42E11 42.11E+11 42.11E-11 42.11E11";
    let lexer = new Lexer(data, lexemDefinition);
    let token = lexer.parse();
    while (!token.isEof()) {
        expect(token.toString()).toMatchSnapshot();
        token = lexer.parse();
    }
});

test("Конец строки распознается", () => {
    const data = "";
    let lexer = new Lexer(data, lexemDefinition);
    let lexem = lexer.parse();
    expect(lexem.toString()).toMatchSnapshot();
});

test("Столбцы считаются корректно", () => {
    const data = "  1234";
    let lexer = new Lexer(data, lexemDefinition);
    let lexem = lexer.parse();
    expect(lexem.toString()).toMatchSnapshot();
});

test("Строки считаются после \\n корректно", () => {
    const data = "  \n\n\n    1234";
    let lexer = new Lexer(data, lexemDefinition);
    let lexem = lexer.parse();
    expect(lexem.toString()).toMatchSnapshot();
});

test("Строки считаются после \\r\\n корректно", () => {
    const data = "  \r\n1234";
    let lexer = new Lexer(data, lexemDefinition);
    let lexem = lexer.parse();
    expect(lexem.toString()).toMatchSnapshot();
});

test("Строки распознаются", () => {
    const data = "'adsas' 'hello world!' ";
    let lexer = new Lexer(data, lexemDefinition);
    let token = lexer.parse();
    while (!token.isEof()) {
        expect(token.toString()).toMatchSnapshot();
        token = lexer.parse();
    }
});

test("Управляющие символы в строках не распознаются", () => {
    const data = "'\nsdfsd'";
    let lexer = new Lexer(data, lexemDefinition);
    let token = lexer.parse();
    while (!token.isEof()) {
        expect(token.toString()).toMatchSnapshot();
        token = lexer.parse();
    }
});

test("Cпециальные значения распознаются корректно", () => {
    const data = keyWords.join(' ');
    let lexer = new Lexer(data, lexemDefinition);
    let token = lexer.parse();
    while (!token.isEof()) {
        expect(token.toString()).toMatchSnapshot();
        token = lexer.parse();
    }
});

const namedSpecialValues = {
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
};

test("Именованные специальные значения распознаются корректно", () => {
    const data = Object.values(namedSpecialValues).join(' ');
    let lexer = new Lexer(data, lexemDefinition);
    let token = lexer.parse();
    while (!token.isEof()) {
        expect(token.toString()).toMatchSnapshot();
        token = lexer.parse();
    }
});

test("Распознается самая длинная лексема", () => {
    const data = "VARCHAR";
    let lexer = new Lexer(data, lexemDefinition);
    let token = lexer.parse();
    while (!token.isEof()) {
        expect(token.toString()).toMatchSnapshot();
        token = lexer.parse();
    }
});