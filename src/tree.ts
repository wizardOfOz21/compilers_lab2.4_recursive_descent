import { Token } from "./token";

export class TokenContainer {
    constructor(public value: Token) {}
}

export class Program {
    constructor(public blocks: (TypeBlock | ConstantBlock)[]) {}
}

export class TypeBlock {
    constructor(public defs: TypeDefinition[]) {}
}

export class ConstantBlock {
    constructor(public defs: ConstantDefinition[]) {}
}

export class TypeDefinition {
    constructor(public ident: Token, public type: Type) {}
}
export class ConstantDefinition {
    constructor(public ident: Token, public constant: Constant) {}
}

export type Type = SimpleType | PointerType | StructuredType;

export type SimpleType = ScalarType | SubrangeType | TypeIdent

export class StructuredType {
    constructor(
        public packed: boolean,
        public type: UnpackedStructuredType,
    ) {}
}

export type UnpackedStructuredType = ArrayType | RecordType | FileType | SetType;

export class ArrayType {
    constructor(
        public index_types: SimpleType[],
        public component_type: Type,
    ){}
}

export class FileType {
    constructor(
        public type: Type,
    ){}
}

export class SetType {
    constructor(
        public base_type: SimpleType,
    ){}
}

export class RecordType {
    constructor(
        public field_list: FieldList,
    ){}
}

export class FieldList {
    constructor(
        public fixed_part: RecordFixedPart | null,
        public variant_part: RecordVariantPart | null,
    ){}
}

export class RecordFixedPart {
    constructor(
        public sections: RecordSection[],
    ){}
}

export class RecordSection {
    constructor(
        public idents: Token[],
        public type: Type,
    ){}
}

export class RecordVariantPart {
    constructor(
        public tag_field: Token,
        public type_ident: Token,
        public variants: RecordVariant[],
    ){}
}

export class RecordVariant {
    constructor(
        public const_label_list: CaseLabelList,
        public list: FieldList | CaseLabelList,
    ){}
}

export class CaseLabelList {
    constructor(
        public list: Token[],
    ){}
}

export class ScalarType {
    constructor(public types: Token[]) {};
}

export class SubrangeType {
    constructor(public start: Constant, public end: Constant) {};
}

export class PointerType extends TokenContainer {}
export class TypeIdent extends TokenContainer {}

export type Constant =
    | SignedConstant
    | UnsignedNumber
    | StringConstant
    | NilConstant;

export class UnsignedConstant extends TokenContainer {}
export class UnsignedNumber extends TokenContainer {}
export class StringConstant extends TokenContainer {}
export class NilConstant extends TokenContainer {}

export class SignedConstant {
    constructor(public sign: Token, public value: UnsignedNumber) {}
}

export function printGraphRec(node, graph: {str: string, id: number}, parent?: number) {
    const id = graph.id++;
    const keys = Object.keys(node);
    let name = node.constructor.name;
    if (name === 'Boolean') {
        name = node;
    }
    graph.str += `${id}[label="${name}"];\n`
    for (let key of keys) {
        const prop = node[key];
        if (Array.isArray(prop)) {
            for (let i = 0; i < prop.length; ++i) {
                const element = prop[i];
                if (element instanceof Token) {
                    const token_id = graph.id++;
                    graph.str += `${token_id}[label="${element.value}"];\n`
                    graph.str += `${id} -> ${token_id}[label="${key}[${i}]"];\n`
                    continue;
                }
                graph.str += `${id} -> ${graph.id}[label="${key}[${i}]"];\n`
                printGraphRec(element, graph, id);
            }
            continue;
        }

        if (prop.constructor.name === 'Token') {
            const token_id = graph.id++;
            graph.str += `${token_id}[label="${prop.value}"];\n`
            graph.str += `${id} -> ${token_id}[label="${key}"];\n`
            continue;
        }

        graph.str += `${id} -> ${graph.id}[label="${key}"];\n`
        printGraphRec(prop, graph, id);
    }
}

export function printGrpah(node): string {
    let graph = {str: '', id: 0};

    graph.str += `digraph graph1 {\n`
    printGraphRec(node, graph);
    graph.str += `}\n`
    return graph.str;
}