import { addGroups, alternativeCombine, match, RegexpMap } from "./regex_utils";
import { EOF, ERROR, Token } from "./token";
import { Position } from "./utils";

export type LexemMap = RegexpMap;

export const NEWLINE = "NEWLINE";
export const NEWLINE_R = "NEWLINE_R";
export const SPACE = "SPACE";

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
        this.regex = alternativeCombine(this.getRegex({...ignoreLexems, ...lexems}), "u");
        this.row = 1;
        this.col = 1;
        this.error = false;
    }

    step(length: number) {
        this.input = this.input.slice(length);
    }

    parse(): Token {
        if (this.input == "") {
            return new Token(EOF, "", new Position(-1, -1));
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
                return new Token(ERROR, "", new Position(this.row, col));
            }
        }
        if (this.error) {
            this.error = false;
        }
        if (lexem == NEWLINE) {
            this.step(1);
            this.row += 1;
            this.col = 1;
            return this.parse();
        } else if (lexem == NEWLINE_R) {
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
