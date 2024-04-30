import { addGroups, alternativeCombine, match, RegexpMap } from "./regex_utils";
import { EOF, ERROR, Token } from "./token";
import { Position } from "./utils";

export type LexemMap = RegexpMap;

export const NEWLINE = "NEWLINE";
export const NEWLINE_R = "NEWLINE_R";
export const SPACE = "SPACE";

const defaultLexems: LexemMap = {
    NEWLINE: /\n/,
    NEWLINE_R: /\r\n/,
    SPACE: /[^\S\r\n]+/,
};

class Lexer {
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
        console.log(lexems);
        this.lexems = { ...Object.keys(defaultLexems), ...Object.keys(lexems) };
        this.regex = alternativeCombine(this.getRegex(lexems), "u");
        console.log(this.regex);
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
        } else if (lexem == SPACE) {
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
