import { lexemDefinition } from "./config";
import Lexer, { printLexems } from "./lexer";

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
    const l = new Lexer(line, lexemDefinition);
    printLexems(l);
});