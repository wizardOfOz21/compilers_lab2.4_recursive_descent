import Lexer from "./lexer";
import { Token } from "./token";
import {
    Constant,
    ConstantBlock,
    ConstantDefinition,
    Program,
    SignedConstant,
    TypeBlock,
    UnsignedConstant,
} from "./tree";

const CONST = "CONST"
const TYPE = "TYPE"
const IDENT = "IDENTIFIER";
const SEMICOLON = "SEMICOLON";
const UNSIGNED_NUMBER = "UNSIGNED_NUMBER";

class Parser {
    private lexer: Lexer;
    private sym: Token;

    constructor(_lexer: Lexer) {
        this.lexer = _lexer;
    }

    is(...domains: string[]) {
        return this.sym.is(...domains);
    }

    nextToken() {
        const prev = this.sym;
        this.sym = this.lexer.parse();
        return prev;
    }

    throw(domain) {
        throw new Error(`no ${domain}`);
    }

    expect(domain: string) {
        if (this.sym.type === domain) {
            return this.nextToken();
        }
        throw new Error(domain);
    }

    parse(): Program {
        this.nextToken();
        const program = this.program();
        this.expect("EOF");
        return program;
    }

    program(): Program {
        const blocks: (ConstantBlock | TypeBlock)[] = [];
        while (this.is(TYPE, CONST)) {
            if (this.is(TYPE)) {
                const typeBlock = this.type_block();
                blocks.push(typeBlock);
            } else {
                const constBlock = this.constant_block();
                blocks.push(constBlock);
            }
        }
        return new Program(blocks);
    }

    constant_block(): ConstantBlock {
        this.expect(CONST);
        const defs: ConstantDefinition[] = [];
        const def = this.constant_definition();
        defs.push(def);
        while (this.is(SEMICOLON)) {
            this.nextToken();
            if (this.is(IDENT)) {
                const def = this.constant_definition();
                defs.push(def);
            }
        }
        return new ConstantBlock(defs);
    }

    constant_definition(): ConstantDefinition {
        const ident = this.expect(IDENT);
        this.expect("EQUAL");
        const constant = this.constant();
        return new ConstantDefinition(ident, constant);
    }

    constant(): Constant {
        if (this.is("NIL", "STRING")) {
            return this.nextToken();
        }
        let sign;
        if (this.is("PLUS", "MINUS")) {
            sign = this.nextToken();
        }
        if (this.sym.is(UNSIGNED_NUMBER)) {
            const token = this.nextToken();
            const u_const = new UnsignedConstant(token);
            if (sign) {
                return new SignedConstant(sign, u_const);
            }
            return u_const;
        } else if (this.sym.is(IDENT)) {
            const token = this.constant_ident();
            return new SignedConstant(sign, token);
        }
        this.throw("constant");
    }

    constant_ident(): Token {
        return this.expect(IDENT);
    }

    type_block() : TypeBlock {
        return new TypeBlock()
    }
}

export default Parser;
