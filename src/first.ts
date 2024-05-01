import { lms } from "./lexer";

export const sign = [
    lms.PLUS, 
    lms.MINUS
];

export const constant = [
    ...sign, 
    lms.UNSIGNED_NUMBER, 
    lms.STRING, 
    lms.NIL,
    lms.IDENTIFIER
];

export const scalarType = [
    lms.LPAREN,
]

export const subrangeType = [
    ...constant,
]

export const typeIdent = [
    lms.IDENTIFIER,
]

export const simpleType = [
    ...scalarType,
    ...subrangeType,
    ...typeIdent,
]

export const pointerType = [
    lms.CARET,
];

export const arrayType = [
    lms.ARRAY,
]

export const recordType = [
    lms.RECORD,
]

export const fileType = [
    lms.FILE,
]

export const setType = [
    lms.SET,
]

export const unpackedStructuredType = [
    ...arrayType,
    ...recordType,
    ...fileType,
    ...setType,
]

export const structuredType = [
    lms.PACKED,
    ...unpackedStructuredType,
]

export const type = [
    ...simpleType,
    ...pointerType,
    ...structuredType,
]

export const typeDefinition = [
    lms.IDENTIFIER,
]

export const typeBlock = [lms.TYPE]

export const constantBlock = [lms.CONST]

export const constantIdent = [lms.IDENTIFIER]

export const indexType = [...simpleType]

export const fixedPart = [lms.IDENTIFIER]

export const unsignedConstant = [lms.NIL, lms.STRING, lms.UNSIGNED_NUMBER, lms.IDENTIFIER]

export const variantPart = [lms.CASE];

export const fieldList = [lms.IDENTIFIER, lms.CASE]

export const caseLabelList = [...unsignedConstant]

export const recordSection = [lms.IDENTIFIER]
