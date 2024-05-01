import { lms } from "./lexer";
import { Position } from "./utils";

export class Token {
    constructor(
        public type: string,
        public value: any,
        public pos: Position
    ) {}

    toString() {
        return `${this.type} ${this.pos.toString()}: ${this.value}`;
    }

    isEof(): boolean {
        return this.type === lms.EOF;
    }

    isError(): boolean {
        return this.type === lms.ERROR;
    }

    is(...domains: string[]): boolean {
        for (let domain of domains) {
            if (this.type === domain) {
                return true;
            }
        }

        return false;
    }
}
