import {tsq} from "@/tsools/query";
import ts from 'typescript';

const describe = tsq.ofKind(ts.SyntaxKind.CallExpression)
    .withChildProp(
        'expression',
        tsq
            .ofKind(ts.SyntaxKind.Identifier)
            .withProp('text', 'describe')
    )
    .withChildArrayProp(
        'arguments',
        0,
        tsq.ofKind(ts.SyntaxKind.StringLiteral)
    )
    .withChildArrayProp(
        'arguments',
        1,
        tsq.ofKind(ts.SyntaxKind.ArrowFunction)
    );

const it = tsq.ofKind(ts.SyntaxKind.CallExpression)
    .withChildProp(
        'expression',
        tsq
            .ofKind(ts.SyntaxKind.Identifier)
            .withProp('text', 'it')
    )
    .withChildArrayProp(
        'arguments',
        0,
        tsq.ofKind(ts.SyntaxKind.StringLiteral)
    )
    .withChildArrayProp(
        'arguments',
        1,
        tsq.ofKind(ts.SyntaxKind.ArrowFunction)
    );

const closestDescribe = tsq.closest(describe);
const closestIt = tsq.closest(it);
const closestItArrowFunctionBody = closestIt.childArrayProp('arguments', 1).child('body');
const closestDescribeDescription = closestDescribe.childArrayProp('arguments', 0);
const closestDescribeArrowFunctionBody = closestDescribe.childArrayProp('arguments', 1).child('body');


export const queries = {
    describe,
    closestDescribe,
    closestDescribeDescription,
    closestDescribeArrowFunctionBody,
    it,
    closestIt,
    closestItArrowFunctionBody
};
