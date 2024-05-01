import { lexemDefinition } from "./config";
import Lexer, { printLexems } from "./lexer";
import Parser from "./parser";
import { printGrpah } from "./tree";

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
    let l = new Lexer(line, lexemDefinition);
    printLexems(l);
    l = new Lexer(line, lexemDefinition);
    const p = new Parser(l);
    const prog = p.parse();
    console.log(prog);
    console.log(printGrpah(prog));
});
