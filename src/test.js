import { controlSymbols, lexemList } from "./config";
import Lexer, { Token } from "./Lexer";

test("Управляющий символ в кавычках не распознается", () => {
    const data = '   \"\n\"    ';
    let lexer = new Lexer(data, lexemList);
    let lexem = lexer.parse();
    expect(lexem.toString()).toMatchSnapshot();
});

test("Идентификатор распознается", () => {
    const data = "testCounter1";
    let lexer = new Lexer(data, lexemList);
    let lexem = lexer.parse();
    expect(lexem.toString()).toMatchSnapshot();
});

test("Целые беззнаковые числа распознаются", () => {
    const data = "011010 123 456 1 0";
    let lexer = new Lexer(data, lexemList);
    let token = lexer.parse();
    while (!token.isEof()) {
        expect(token.toString()).toMatchSnapshot();
        token = lexer.parse();
    }
});

test("Числа с плавающей точкой распознаются", () => {
    const data = "1E+11 42E-11 42E11 42.11E+11 42.11E-11 42.11E11";
    let lexer = new Lexer(data, lexemList);
    let token = lexer.parse();
    while (!token.isEof()) {
        expect(token.toString()).toMatchSnapshot();
        token = lexer.parse();
    }
});

test("Конец строки распознается", () => {
    const data = "";
    let lexer = new Lexer(data, lexemList);
    let lexem = lexer.parse();
    expect(lexem.toString()).toMatchSnapshot();
});

test("Символ распознается", () => {
    const data = "\"A\"";
    let lexer = new Lexer(data, lexemList);
    let lexem = lexer.parse();
    expect(lexem.toString()).toMatchSnapshot();
});

test("Двойная кавычка распознается", () => {
    const data = '""""';
    let lexer = new Lexer(data, lexemList);
    let lexem = lexer.parse();
    expect(lexem.toString()).toMatchSnapshot();
});

test("Управляющие символы числами распознаются", () => {
    for (let i = 0; i < 32; i++) {
        const data = `$${i}$`;
        let lexer = new Lexer(data, lexemList);
        let lexem = lexer.parse();
        expect(lexem.toString()).toMatchSnapshot();
    }
});

test("Управляющие символы буквами распознаются", () => {
    for (let key in controlSymbols) {
        const data = `$${key}$`;
        let lexer = new Lexer(data, lexemList);
        let lexem = lexer.parse();
        expect(lexem.toString()).toMatchSnapshot();
    }
});

test("Строка в апострофах с управляющим символом не распознается", () => {
    for (let key in controlSymbols) {
        const data = `'asdasfdsf123 123 \n 123'`;
        let lexer = new Lexer(data, lexemList);
        let lexem = lexer.parse();
        expect(lexem.toString()).toMatchSnapshot();
    }
});

test("Столбцы считаются корректно", () => {
    const data = "  1234";
    let lexer = new Lexer(data, lexemList);
    let lexem = lexer.parse();
    expect(lexem.toString()).toMatchSnapshot();
});

test("Строки считаются после \\n корректно", () => {
    const data = "  \n\n\n    1234";
    let lexer = new Lexer(data, lexemList);
    let lexem = lexer.parse();
    expect(lexem.toString()).toMatchSnapshot();
});

test("Строки считаются после \\r\\n корректно", () => {
    const data = "  \r\n1234";
    let lexer = new Lexer(data, lexemList);
    let lexem = lexer.parse();
    expect(lexem.toString()).toMatchSnapshot();
});