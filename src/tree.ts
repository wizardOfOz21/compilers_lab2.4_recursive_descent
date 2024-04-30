import { Token } from "./token";

export class Program {
    constructor(public blocks: (TypeBlock | ConstantBlock)[]) {}
}

export class TypeBlock {}

export class ConstantBlock {
    constructor(public defs: ConstantDefinition[]) {}
}

export class ConstantDefinition {
    constructor(public ident: Token, public constant: Constant) {}
}

export type Constant =
    | SignedConstant
    | UnsignedConstant
    | StringConstant
    | NilConstant;

export class TokenContainer {
    constructor(public value: Token) {}
}

export class UnsignedConstant extends TokenContainer {}
export class StringConstant extends TokenContainer {}
export class NilConstant extends TokenContainer {}

export class SignedConstant {
    constructor(public sign: Token, public value: UnsignedConstant | Token) {}
}

export function printGraphRec(node, graph: {str: string, id: number}, parent?: number) {
    const id = graph.id++;
    const className = node.constructor.name;
    const keys = Object.keys(node);
    graph.str += `${id}[label="${className}"];\n`
    for (let key of keys) {
        const prop = node[key];
        if (Array.isArray(prop)) {
            for (let i = 0; i < prop.length; ++i) {
                const element = prop[i];
                if (element instanceof Token) {
                    const token_id = graph.id++;
                    graph.str += `${token_id}[label="${element.type}:${element.value}"];\n`
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
            graph.str += `${token_id}[label="${prop.type}:${prop.value}"];\n`
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