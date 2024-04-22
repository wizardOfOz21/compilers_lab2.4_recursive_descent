import { lexemList } from "./config";
import Lexer, {EOF, ERROR, Lexem} from "./Lexer";

const fs = require("node:fs");

export function lexemFormat(lexem: Lexem) {
    return `${lexem.type} (${lexem.row},${lexem.col}): ${lexem.value}`;
}

function print(lexer: Lexer) {
    let lexem: Lexem = lexer.parse();
    while (lexem.type != EOF) {
        if (lexem.type == ERROR) {
            console.log(`syntax error (${lexem.row},${lexem.col})`);
        } else {
            console.log(lexemFormat(lexem));
        }
        lexem = lexer.parse();
    }
}

fs.readFile("input.txt", "utf8", (err, data: string) => {
    if (err) {
        console.error(err);
        return;
    }
    let lexer = new Lexer(data, lexemList);
    print(lexer);
});
