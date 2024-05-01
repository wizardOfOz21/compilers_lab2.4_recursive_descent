import { addGroups, alternativeCombine, match, RegexpMap } from "./regex_utils";
import { Token } from "./token";
import { Position } from "./utils";

export const lms = {
    LPAREN: 'LPAREN',
    RPAREN: 'RPAREN',
    COMMA: 'COMMA',
    POINTS: 'POINTS',
    CARET: 'CARET',
    PLUS: 'PLUS',
    MINUS: 'MINUS',
    LBRACKET: 'LBRACKET',
    RBRACKET: 'RBRACKET',
    EQUAL: 'EQUAL',
    COLON: 'COLON',
    SEMICOLON: 'SEMICOLON',
    NIL: 'NIL',
    PACKED: 'PACKED',
    OF: 'OF',
    ARRAY: 'ARRAY',
    FILE: 'FILE',
    SET: 'SET',
    RECORD: 'RECORD',
    END: 'END',
    TYPE: 'TYPE',
    VAR: 'VAR',
    CASE: 'CASE',
    CONST: 'CONST',
    IDENTIFIER: 'IDENTIFIER',
    UNSIGNED_NUMBER: 'UNSIGNED_NUMBER',
    STRING: 'STRING',
    EOF: 'EOF',
    ERROR: 'ERROR',
    NEWLINE: "NEWLINE",
    NEWLINE_R: "NEWLINE_R",
    SPACE: "SPACE",
    COMMENT_1: "COMMENT_1",
    COMMENT_2: "COMMENT_2",
  }

export type LexemMap = RegexpMap;

export const ignoreLexems: LexemMap = {
    SPACE: /[^\S\r\n]+/,
    COMMENT_1: /\{[^}]*\}/u,
    COMMENT_2: /\(\*((?!\*\))[\s\S])*\*\)/u,
}

const defaultLexems: LexemMap = {
    NEWLINE: /\n/,
    NEWLINE_R: /\r\n/,
};

class Lexer {
    private ignore: string[];
    private lexems: string[];
    private regex: RegExp;
    private row: number;
    private col: number;
    private error: boolean;
    private input: string;

    getRegex(lexems: LexemMap): LexemMap {
        return addGroups({...defaultLexems, ...lexems });
    }

    constructor(input: string, lexems: LexemMap) {
        this.input = input;
        this.lexems = {
            ...Object.keys(defaultLexems),
            ...Object.keys(lexems),
            ...Object.keys(ignoreLexems),
        };
        this.regex = alternativeCombine(this.getRegex({...ignoreLexems, ...lexems}), "iu");
        this.row = 1;
        this.col = 1;
        this.error = false;
    }

    step(length: number) {
        this.input = this.input.slice(length);
    }

    parse(): Token {
        if (this.input == "") {
            return new Token(lms.EOF, "", new Position(-1, -1));
        }
        let matchResult = match(this.input, this.regex);
        let value = matchResult && matchResult.input;
        let groups = matchResult && matchResult.groups;
        let lexem =
            groups &&
            Object.keys(groups).find(
                (key) => !!groups[key] || groups[key] == ""
            );

        if (!matchResult) {
            let col = this.col;
            this.step(1);
            this.col += 1;
            if (this.error) {
                return this.parse();
            } else {
                this.error = true;
                return new Token(lms.ERROR, "", new Position(this.row, col));
            }
        }
        if (this.error) {
            this.error = false;
        }
        if (lexem == lms.NEWLINE) {
            this.step(1);
            this.row += 1;
            this.col = 1;
            return this.parse();
        } else if (lexem == lms.NEWLINE_R) {
            this.step(2);
            this.row += 1;
            this.col = 1;
            return this.parse();
        } else if (lexem in ignoreLexems) {
            value = groups[lexem];
            this.step(value.length);
            this.col += value.length;
            return this.parse();
        }
        value = groups[lexem];
        this.step(value.length);
        let col = this.col;
        this.col += value.length;

        return new Token(lexem, value, new Position(this.row, col));
    }
}

export default Lexer;

export function printLexems(lexer: Lexer) {
    let token: Token = lexer.parse();
    while (!token.isEof()) {
        if (token.isError()) {
            console.log(`syntax error (${token.pos.row},${token.pos.col})`);
        } else {
            console.log(token.toString());
        }
        token = lexer.parse();
    }
}
