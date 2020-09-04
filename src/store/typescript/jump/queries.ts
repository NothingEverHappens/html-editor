import {tsq} from "@/tsools/query";
import ts from 'typescript';



export const queries = {
    classDeclaration: tsq.ofKind(ts.SyntaxKind.ClassDeclaration),
    identifier: tsq.ofKind(ts.SyntaxKind.Identifier),
    jsx: tsq.ofKind(ts.SyntaxKind.JsxOpeningElement, ts.SyntaxKind.JsxSelfClosingElement),
    parameter: tsq.ofKind( ts.SyntaxKind.Parameter),
    PropertyDeclaration: tsq.ofKind( ts.SyntaxKind.PropertyDeclaration),
};
