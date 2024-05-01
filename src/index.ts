import { lexemDefinition } from "./config";

import Lexer, { printLexems } from "./lexer";
import Parser from "./parser";
import { Token } from "./token";
import { printGrpah } from "./tree";

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
    const p = new Parser(lexer);
    const prog = p.parse();
    console.log(printGrpah(prog));
});
