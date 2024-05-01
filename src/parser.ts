import { lms } from "./lexer";
import * as fst from "./first";
import Lexer from "./lexer";
import { Token } from "./token";
import {
    ArrayType,
    Constant,
    ConstantBlock,
    ConstantDefinition,
    FileType,
    PointerType,
    Program,
    ScalarType,
    SetType,
    SignedConstant,
    SimpleType,
    StructuredType,
    SubrangeType,
    Type,
    TypeBlock,
    TypeDefinition,
    UnpackedStructuredType,
    UnsignedConstant,
} from "./tree";

class Parser {
    private lexer: Lexer;
    private sym: Token;

    constructor(_lexer: Lexer) {
        this.lexer = _lexer;
    }

    is(...args): boolean {
        let Args = [];
        for (let arg of args) {
            if (Array.isArray(arg)) {
                Args = Args.concat(arg);
                continue;
            }
            Args.push(arg);
        }
        return this.sym.is(...Args);
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
        if (this.is(domain)) {
            return this.nextToken();
        }
        throw new Error(domain);
    }

    parse(): Program {
        this.nextToken();
        const program = this.program();
        this.expect(lms.EOF);
        return program;
    }

    // program ::= (type_block | constant_block)*
    program(): Program {
        console.log("program");
        const blocks: (ConstantBlock | TypeBlock)[] = [];
        while (this.is(fst.typeBlock, fst.constantBlock)) {
            if (this.is(fst.typeBlock)) {
                const typeBlock = this.type_block();
                blocks.push(typeBlock);
            } else {
                const constBlock = this.constant_block();
                blocks.push(constBlock);
            }
        }
        return new Program(blocks);
    }

    // constant_block ::= 'CONST' constant_definition (; constant_definition?)*
    constant_block(): ConstantBlock {
        this.expect(lms.CONST);
        const defs: ConstantDefinition[] = [];
        const def = this.constant_definition();
        defs.push(def);
        while (this.is(lms.SEMICOLON)) {
            this.nextToken();
            if (this.is(lms.IDENTIFIER)) {
                const def = this.constant_definition();
                defs.push(def);
            }
        }
        return new ConstantBlock(defs);
    }

    // constant_definition ::= IDENT = constant
    constant_definition(): ConstantDefinition {
        const ident = this.expect(lms.IDENTIFIER);
        this.expect(lms.EQUAL);
        const constant = this.constant();
        return new ConstantDefinition(ident, constant);
    }

    // constant ::= sign? UNSIGNED_NUMBER | STRING | 'NIL'
    constant(): Constant {
        if (this.is(lms.NIL, lms.STRING)) {
            return this.nextToken();
        }
        let sign;
        if (this.is(fst.sign)) {
            sign = this.nextToken();
        }
        if (!this.is(lms.UNSIGNED_NUMBER)) {
            this.throw("constant");
        }
        const token = this.nextToken();
        const u_const = new UnsignedConstant(token);
        return sign ? new SignedConstant(sign, u_const) : u_const;
    }

    // type_block ::= 'TYPE' type_definition (; type_definition?)*
    type_block(): TypeBlock {
        console.log("type_block");
        this.expect(lms.TYPE);
        const defs: TypeDefinition[] = [];
        const def = this.type_definition();
        defs.push(def);
        while (this.is(lms.SEMICOLON)) {
            this.nextToken();
            if (this.is(lms.IDENTIFIER)) {
                const def = this.type_definition();
                defs.push(def);
            }
        }
        return new TypeBlock(defs);
    }

    // type_definition ::= IDENT = type
    type_definition(): TypeDefinition {
        console.log("type_definition");
        const ident = this.expect(lms.IDENTIFIER);
        this.expect(lms.EQUAL);
        const type = this.type();
        return new TypeDefinition(ident, type);
    }

    // type ::= simple_type | pointer_type | structured_type
    type(): Type {
        console.log("type");
        if (this.is(fst.simpleType)) {
            return this.simple_type();
        }
        if (this.is(fst.pointerType)) {
            return this.pointer_type();
        }
        if (this.is(fst.structuredType)) {
            return this.structured_type();
        }
        this.throw("type");
    }

    // simple_type ::= scalar_type | subrange_type | type_ident
    simple_type(): SimpleType {
        console.log("simple_type");
        if (this.is(fst.scalarType)) {
            return this.scalar_type();
        }
        if (this.is(fst.typeIdent)) {
            return this.type_ident();
        }
        if (this.is(fst.subrangeType)) {
            return this.subrange_type();
        }
        this.throw("simpleType");
    }

    // scalar_type ::= '(' IDENT (, IDENT)* ')'
    scalar_type(): ScalarType {
        this.expect(lms.LPAREN);
        const idents: Token[] = [];
        const ident = this.expect(lms.IDENTIFIER);
        idents.push(ident);
        while (this.is(lms.COMMA)) {
            this.nextToken();
            const ident = this.expect(lms.IDENTIFIER);
            idents.push(ident);
        }
        this.expect(lms.RPAREN);
        return new ScalarType(idents);
    }

    // subrange_type ::= constant .. constant
    subrange_type(): SubrangeType {
        const start = this.constant();
        this.expect(lms.POINTS);
        const end = this.constant();
        return new SubrangeType(start, end);
    }

    // type_ident ::= IDENT
    type_ident(): Token {
        console.log("type_ident");
        return this.expect(lms.IDENTIFIER);
    }

    // pointer_type ::= ^ type_ident
    pointer_type(): PointerType {
        console.log("pointer_type");
        this.expect(lms.CARET);
        const ident = this.type_ident();
        return new PointerType(ident);
    }

    // structured_type ::= 'PACKED'? unpacked_structured_type
    structured_type(): StructuredType {
        let packed = false;
        if (this.is(lms.PACKED)) {
            packed = true;
            this.nextToken();
        }
        const type = this.unpacked_structured_type();
        return new StructuredType(packed, type);
    }

    // unpacked_structured_type = array_type | record_type | file_type | set_type
    unpacked_structured_type(): UnpackedStructuredType {
        if (this.is(fst.arrayType)) {
            return this.array_type();
        }
        if (this.is(fst.recordType)) {
            // return this.record_type();
        }
        if (this.is(fst.fileType)) {
            return this.file_type();
        }
        if (this.is(fst.setType)) {
            return this.set_type();
        }
        this.throw("unpacked_structured_type");
    }

    // array_type ::= 'ARRAY' [ index_type (, index_type)* ] 'OF' component_type
    array_type(): ArrayType {
        this.expect(lms.ARRAY);
        this.expect(lms.LBRACKET);
        const index_types = [];
        const type = this.index_type();
        index_types.push(type);
        while (this.is(lms.COMMA)) {
            this.nextToken();
            const type = this.index_type();
            index_types.push(type);
        }
        this.expect(lms.RBRACKET);
        this.expect(lms.OF);
        const component_type = this.component_type();
        return new ArrayType(index_types, component_type);
    }

    // index_type ::= simple_type
    index_type(): SimpleType {
        return this.simple_type();
    }

    // component_type ::= type
    component_type(): Type {
        return this.type();
    }

    // set_type ::= 'SET' 'OF' base_type
    set_type(): SetType {
        this.expect(lms.SET);
        this.expect(lms.OF);
        const type = this.base_type();
        return new SetType(type);
    }

    // base_type ::= simple_type
    base_type(): SimpleType {
        return this.simple_type();
    }

    // file_type ::= 'FILE' 'OF' type
    file_type(): FileType {
        this.expect(lms.FILE);
        this.expect(lms.OF);
        const type = this.type();
        return new FileType(type);
    }
}

export default Parser;
