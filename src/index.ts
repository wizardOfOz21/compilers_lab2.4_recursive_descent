import { lexemDefinition } from "./config";

import Lexer, { printLexems } from "./lexer";
import { Token, EOF, ERROR } from "./token";

const fs = require("node:fs");

export function lexemFormat(token: Token) {
    return `${token.type} (${token.pos.row},${token.pos.col}): ${token.value}`;
}

fs.readFile("input.txt", "utf8", (err, data: string) => {
    if (err) {
        console.error(err);
        return;
    }
    let lexer = new Lexer(data, lexemDefinition);
    printLexems(lexer);
});
