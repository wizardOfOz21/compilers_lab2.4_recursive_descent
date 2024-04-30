import { Position } from "./utils";
export const EOF: string = "EOF";
export const ERROR: string = "ERROR";

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
        return this.type === EOF;
    }

    isError(): boolean {
        return this.type === ERROR;
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
