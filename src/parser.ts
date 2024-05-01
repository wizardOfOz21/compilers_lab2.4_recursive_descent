import { lms } from "./lexer";
import * as fst from "./first";
import Lexer from "./lexer";
import { Token } from "./token";
import {
    ArrayType,
    CaseLabelList,
    Constant,
    ConstantBlock,
    ConstantDefinition,
    FieldList,
    FileType,
    PointerType,
    Program,
    RecordFixedPart,
    RecordSection,
    RecordType,
    RecordVariant,
    RecordVariantPart,
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

    // unsigned_constant ::= UNSIGNED_NUMBER | STRING | 'NIL'
    unsigned_constant(): UnsignedConstant {
        console.log(this.sym);
        if (this.is(fst.unsignedConstant)) {
            return this.nextToken();
        }
        this.throw("unsigned_constant");
    }

    // constant ::= sign? UNSIGNED_NUMBER | STRING
    constant(): Constant {
        if (this.is(lms.STRING)) {
            return this.nextToken();
        }
        let sign;
        if (this.is(fst.sign)) {
            sign = this.nextToken();
        }
        if (!this.is(lms.UNSIGNED_NUMBER, lms.IDENTIFIER)) {
            this.throw("constant");
        }
        let token;
        if (this.is(lms.UNSIGNED_NUMBER)) {
            token = this.nextToken();
        } else {
            token = this.constant_ident();
        }
        const u_const = new UnsignedConstant(token);
        return sign ? new SignedConstant(sign, u_const) : u_const;
    }

    // constant_ident ::= IDENT
    constant_ident(): Token {
        return this.expect(lms.IDENTIFIER);
    }

    // type_block ::= 'TYPE' type_definition (; type_definition?)*
    type_block(): TypeBlock {
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
        const ident = this.expect(lms.IDENTIFIER);
        this.expect(lms.EQUAL);
        const type = this.type();
        return new TypeDefinition(ident, type);
    }

    // type ::= simple_type | pointer_type | structured_type
    type(): Type {
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
        if (this.is(fst.scalarType)) {
            return this.scalar_type();
        }
        if (this.is(lms.IDENTIFIER)) {
            // пришлось заглянуть вперед на 2 токена (X
            const ident = this.nextToken();
            if (this.is(lms.POINTS)) {
                this.nextToken();
                const end = this.constant();
                return new SubrangeType(ident, end);
            }
            return ident;
        }
        if (this.is(fst.subrangeType)) {
            return this.subrange_type();
        }
        this.throw("simpleType");
    }

    // subrange_type ::= constant .. constant
    subrange_type(): SubrangeType {
        const start = this.constant();
        this.expect(lms.POINTS);
        const end = this.constant();
        return new SubrangeType(start, end);
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

    // type_ident ::= IDENT
    type_ident(): Token {
        return this.expect(lms.IDENTIFIER);
    }

    // pointer_type ::= ^ type_ident
    pointer_type(): PointerType {
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
            return this.record_type();
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

    // record_type ::= 'RECORD' field_list 'END'
    record_type(): RecordType {
        this.expect(lms.RECORD);
        const field_list = this.field_list();
        this.expect(lms.END);
        return new RecordType(field_list);
    }

    // field_list ::= fixed_part variant_part | variant_part
    field_list(): FieldList {
        if (this.is(fst.fixedPart)) {
            const fixed_part = this.fixed_part();
            let variant_part = null;
            if (this.is(fst.variantPart)) {
                variant_part = this.variant_part();
            }
            return new FieldList(fixed_part, variant_part);
        }
        if (this.is(fst.variantPart)) {
            const variant_part = this.variant_part();
            return new FieldList(null, variant_part);
        }
        this.throw("field_list");
    }

    // fixed_part ::= record_section (; record_section)*
    fixed_part(): RecordFixedPart {
        const sections = [];
        const section = this.record_section();
        sections.push(section);
        while (this.is(lms.SEMICOLON)) {
            this.nextToken();
            if (this.is(fst.recordSection)) {
                const section = this.record_section();
                sections.push(section);
            }
        }
        return new RecordFixedPart(sections);
    }

    // record_section ::= field_ident (, field_ident)* : type
    record_section(): RecordSection {
        console.log('section');
        const idents = [];
        const ident = this.field_ident();
        idents.push(ident);
        while (this.is(lms.COMMA)) {
            this.nextToken();
            const ident = this.field_ident();
            idents.push(ident);
        }
        this.expect(lms.COLON);
        const type = this.type();
        return new RecordSection(idents, type);
    }

    // field_ident ::= IDENT
    field_ident(): Token {
        return this.expect(lms.IDENTIFIER);
    }

    // variant_part ::= 'CASE' tag_field : type_ident of variant (; variant)*
    variant_part(): RecordVariantPart {
        console.log('variant_part');
        this.expect(lms.CASE);
        const tag = this.tag_field();
        this.expect(lms.COLON);
        const type = this.type_ident();
        this.expect(lms.OF);
        const variants = [];
        const variant = this.variant();
        variants.push(variant);
        console.log(this.sym);
        while (this.is(lms.SEMICOLON)) {
            this.nextToken();
            const variant = this.variant();
            variants.push(variant);
        }
        return new RecordVariantPart(tag, type, variants);
    }

    // variant ::= case_label_list : '(' field_list | case_label_list ')'
    variant(): RecordVariant {
        console.log('variant');
        const const_list = this.case_label_list();
        this.expect(lms.COLON);
        let list;
        if (this.is(lms.LPAREN)) {
            this.nextToken();
            list = this.field_list();
            this.expect(lms.RPAREN);
        } else if (this.is(fst.caseLabelList)) {
            list = this.case_label_list();
        }
        console.log('variant end');
        return new RecordVariant(const_list, list);
    }

    // case_label_list ::= case_label (, case_label)*
    case_label_list(): CaseLabelList {
        console.log('case_label_list');
        const labels = [];
        const label = this.case_label();
        labels.push(label);
        while (this.is(lms.COMMA)) {
            this.nextToken();
            const label = this.case_label();
            labels.push(label);
        }
        console.log('123');
        return new CaseLabelList(labels);
    }

    // case_label ::= unsigned_constant
    case_label(): UnsignedConstant {
        return this.unsigned_constant();
    }

    // tag_field ::= IDENT
    tag_field(): Token {
        return this.expect(lms.IDENTIFIER);
    }
}

export default Parser;
