import {EditorState} from "@/store/types";
import {EditorUtils} from "@/store/utils/utils";

import ts from 'typescript';

export class EditorJasmine {

    constructor(private readonly state: EditorState,
                private readonly utils: EditorUtils) {

    }

    addDescribe() {
        this.utils.ts.transformVisit((node, context) => {
            const describe =
                ts.createExpressionStatement(
                    ts.createCall(ts.createIdentifier('describe'), undefined, [
                        ts.createStringLiteral(''),
                        ts.createArrowFunction(
                            undefined,
                            undefined,
                            [],
                            undefined,
                            ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                            ts.createBlock([], true)
                        )
                    ])
                );


            if (ts.isSourceFile(node)) {
                // eslint-disable-next-line no-debugger
                return ts.updateSourceFileNode(node, [
                    ...node.statements,
                    describe
                ]);

            }
            return node;
        });
    }

    isDescribe(node: ts.Node) {
        return ts.isCallExpression(node)
            && ts.isStringLiteral(node.arguments[0])
            && ts.isIdentifier(node.expression)
            && node.expression.text === 'describe';
    }

    getClosestDescribe(): ts.CallExpression {
        const result = this.findClosestDescribe();
        if (!result) {
            throw 'describe not found';
        }

        return result;
    }

    findClosestDescribe(): ts.CallExpression | undefined {
        let node = this.utils.ts.node;
        while (node && !this.isDescribe(node)) {
            node = node.parent;
            if (!node) {
                return;
            }
        }

        return node as ts.CallExpression;
    }

    getClosestDescribeDescription() {
        const describe = this.getClosestDescribe();

        const firstArg = describe.arguments[0];
        if (ts.isStringLiteral(firstArg)) {
            return firstArg;
        }
        throw 'cannot find closese describe';
    }

    getDescribeText() {
        return this.getClosestDescribeDescription().text;
    }

    renameDescribe(name: string) {
        this.utils.ts.replaceNode(this.getClosestDescribeDescription(), ts.createStringLiteral(name));
    }

    addIt() {
        const newIt = ts.createExpressionStatement(
            ts.createCall(ts.createIdentifier('it'), undefined, [
                ts.createStringLiteral('lol'),
                ts.createArrowFunction(
                    undefined,
                    undefined,
                    [],
                    undefined,
                    ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                    ts.createBlock([], true)
                )
            ])
        );


        const closestDescribe = this.getClosestDescribe();
        const arrowFunction = closestDescribe.arguments[1] as ts.ArrowFunction;
        const body = arrowFunction.body as ts.Block;
        console.assert(ts.isBlock(body)); // Could be an expression

        this.utils.ts.transformNode(body, (node: ts.Block) => {
            return ts.updateBlock(node, [...node.statements, newIt])
        })
    }
}
