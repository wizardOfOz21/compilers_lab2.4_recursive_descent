const match = (str: string, regex: RegExp) => str.match(regex);

export interface LexemList {
    [key: string]: RegExp;
}

export const EOF: string = "EOF";
export const ERROR: string = "ERROR";
export const NEWLINE: string = "NEWLINE";
export const SPACE: string = "SPACE";

export interface Lexem {
    type: string,
    value: any,
    col: number,
    row: number,
}

const defaultLexems = {
    [NEWLINE]: new RegExp(`(?<${NEWLINE}>\\n)`),
    [SPACE]: new RegExp(`(?<${SPACE}>[^\\S\\r\\n]+)`),
}

function combine(lexems: LexemList): RegExp {
    const source: string = Object.values(lexems).reduce(
        (prev, current: RegExp) => prev + "|" + current.source,
        ""
    ) as string;
    return new RegExp(`^(${source.slice(1)})`, "u");
}

enum LexerState {
    INITIAL,
    STRING,
}

class Lexer {
    private lexems: string[];
    private regex: RegExp;
    private row: number;
    private col: number;
    private error: boolean;
    private state: LexerState;

    constructor(
        private input: string,
        lexems: LexemList,
    ) {
        this.lexems = {...defaultLexems, ...Object.keys(lexems)};
        this.regex = combine(lexems);
        this.row = 1;
        this.col = 1;
        this.error = false;
        this.state = LexerState.INITIAL;
    }

    step(length: number) {
        this.input = this.input.slice(length);
    }

    parse(): Lexem {
        if (this.input == "") {
            return { type: EOF, value: "", row: -1, col: -1 };
        }
        let matchResult = match(this.input, this.regex);
        let value = matchResult && matchResult.input;
        let groups = matchResult && matchResult.groups;
        let lexem = groups && Object.keys(groups).find((key) => !!groups[key] || groups[key] == '');

        if (!matchResult) {
            let col = this.col;
            this.step(1);
            this.col += 1;
            if (this.error) {
                return this.parse();
            } else {
                this.error = true;
                return {
                    type: ERROR,
                    value: "",
                    row: this.row,
                    col,
                };
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
        } else if (lexem == SPACE) {
            value = groups[lexem];
            this.step(value.length);
            this.col += value.length;
            return this.parse();
        }
        value = groups[lexem];
        console.log(lexem);
        this.step(value.length);
        let col = this.col;
        this.col += value.length;
        
        return { type: lexem, value, row: this.row, col };
    }
}

export default Lexer
