const match = (str: string, regex: RegExp) => str.match(regex);

export interface LexemList {
    [key: string]: RegExp;
}

export const EOF: string = "EOF";
export const ERROR: string = "ERROR";
export const NEWLINE: string = "NEWLINE";
export const NEWLINE_R: string = "NEWLINE_R";
export const SPACE: string = "SPACE";

export class Position {
    constructor(
        public row: number,
        public col: number,
    ) {}

    toString() {
        return `(${this.row},${this.col})`;
    }
}

export class Token {
    constructor(
        public type: string,
        public value: any,
        public pos: Position
    ) {}

    toString() {
        return `${this.type} ${this.pos.toString()}: ${this.value}`;
    }

    isEof() {
        return this.type === EOF;
    }

    isError() {
        return this.type === ERROR;
    }
}

const defaultLexems = {
    [NEWLINE]: new RegExp(`(?<${NEWLINE}>\\n)`),
    [SPACE]: new RegExp(`(?<${SPACE}>[^\\S\\r\\n]+)`),
};

function combine(lexems: LexemList): RegExp {
    const source: string = Object.values(lexems).reduce(
        (prev, current: RegExp) => prev + "|" + current.source,
        ""
    ) as string;
    return new RegExp(`^(${source.slice(1)})`, "u");
}

class Lexer {
    private lexems: string[];
    private regex: RegExp;
    private row: number;
    private col: number;
    private error: boolean;
    private input: string

    constructor(input: string, lexems: LexemList) {
        this.input = input;
        this.lexems = { ...defaultLexems, ...Object.keys(lexems) };
        this.regex = combine(lexems);
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
                return new Token(ERROR, "", new Position(this.row,col));
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
