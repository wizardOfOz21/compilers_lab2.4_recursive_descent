import { lexemFormat } from ".";
import { controlSymbols, lexemList } from "./config";
import Lexer from "./Lexer";

// test("Управляющий символ в кавычках не распознается", () => {
//     const data = '   \"\n\"    ';
//     let lexer = new Lexer(data, lexemList);
//     let lexem = lexer.parse();
//     expect(lexemFormat(lexem)).toBe("ERROR (1,1): ");
// });

// test("Идентификатор с _ распознается", () => {
//     const data = "_testCounter1";
//     let lexer = new Lexer(data, lexemList);
//     let lexem = lexer.parse();
//     expect(lexemFormat(lexem)).toBe("IDENT (1,1): _testCounter1");
// });

// test("Идентификатор с . распознается", () => {
//     const data = ".testCounter1";
//     let lexer = new Lexer(data, lexemList);
//     let lexem = lexer.parse();
//     expect(lexemFormat(lexem)).toBe("IDENT (1,1): .testCounter1");
// });

// test("Идентификатор с @ распознается", () => {
//     const data = "@testCounter1";
//     let lexer = new Lexer(data, lexemList);
//     let lexem = lexer.parse();
//     expect(lexemFormat(lexem)).toBe("IDENT (1,1): @testCounter1");
// });

// test("Идентификатор с ! распознается", () => {
//     const data = "!testCounter1";
//     let lexer = new Lexer(data, lexemList);
//     let lexem = lexer.parse();
//     expect(lexemFormat(lexem)).toBe("IDENT (1,1): !testCounter1");
// });

// test("Идентификатор с # распознается", () => {
//     const data = "#testCounter1";
//     let lexer = new Lexer(data, lexemList);
//     let lexem = lexer.parse();
//     expect(lexemFormat(lexem)).toBe("IDENT (1,1): #testCounter1");
// });

// test("Двоичное число распознается", () => {
//     const data = "011010{2}";
//     let lexer = new Lexer(data, lexemList);
//     let lexem = lexer.parse();
//     expect(lexemFormat(lexem)).toBe("NUMBER_2 (1,1): 011010{2}");
// });

// test("Десятичное число без указания СС распознается", () => {
//     const data = "1234";
//     let lexer = new Lexer(data, lexemList);
//     let lexem = lexer.parse();
//     expect(lexemFormat(lexem)).toBe("NUMBER (1,1): 1234");
// });

// test("Одиннадцатеричное число распознается", () => {
//     const data = "1234A{11}";
//     let lexer = new Lexer(data, lexemList);
//     let lexem = lexer.parse();
//     expect(lexemFormat(lexem)).toBe("NUMBER_11 (1,1): 1234A{11}");
// });

// test("Конец строки распознается", () => {
//     const data = "";
//     let lexer = new Lexer(data, lexemList);
//     let lexem = lexer.parse();
//     expect(lexemFormat(lexem)).toBe("EOF (-1,-1): ");
// });

// test("Символ распознается", () => {
//     const data = "\"A\"";
//     let lexer = new Lexer(data, lexemList);
//     let lexem = lexer.parse();
//     expect(lexemFormat(lexem)).toBe("SYMBOL (1,1): \"A\"");
// });

// test("Двойная кавычка распознается", () => {
//     const data = '""""';
//     let lexer = new Lexer(data, lexemList);
//     let lexem = lexer.parse();
//     expect(lexemFormat(lexem)).toBe("SYMBOL_QUOTE (1,1): \"\"\"\"");
// });

// test("Управляющие символы числами распознаются", () => {
//     for (let i = 0; i < 32; i++) {
//         const data = `$${i}$`;
//         let lexer = new Lexer(data, lexemList);
//         let lexem = lexer.parse();
//         expect(lexemFormat(lexem)).toBe(`CONTROL_SYMBOL_NUMERIC (1,1): $${i}$`);
//     }
// });

// test("Управляющие символы буквами распознаются", () => {
//     for (let key in controlSymbols) {
//         const data = `$${key}$`;
//         let lexer = new Lexer(data, lexemList);
//         let lexem = lexer.parse();
//         expect(lexemFormat(lexem)).toBe(`CONTROL_SYMBOL_ALPHABETIC (1,1): $${key}$`);
//     }
// });

// test("Строка в апострофах с управляющим символом не распознается", () => {
//     for (let key in controlSymbols) {
//         const data = `'asdasfdsf123 123 \n 123'`;
//         let lexer = new Lexer(data, lexemList);
//         let lexem = lexer.parse();
//         expect(lexemFormat(lexem)).toBe(`ERROR (1,1): `);
//     }
// });

// test("Строка в апострофах распознается", () => {
//     for (let key in controlSymbols) {
//         const data = `'asdasfdsf123 123 \\n123'`;
//         let lexer = new Lexer(data, lexemList);
//         let lexem = lexer.parse();
//         expect(lexemFormat(lexem)).toBe(`STRING (1,1): 'asdasfdsf123 123 \\n123'`);
//     }
// });