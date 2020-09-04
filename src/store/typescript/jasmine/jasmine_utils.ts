import {EditorState} from "@/store/types";
import {EditorUtils} from "@/store/utils/utils";

import ts from 'typescript';
import {queries} from "@/store/typescript/jasmine/queries";

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


    hasClosestDescribe() {
        return !!this.getClosestDescribe();
    }

    getClosestDescribe() {
        return queries.closestDescribe.singleNode(this.utils.ts.node);
    }


    getClosestDescribeDescription() {
        return queries.closestDescribeDescription.singleNode(this.utils.ts.node);
    }

    getDescribeText() {
        return (this.getClosestDescribeDescription() as ts.Identifier).text;
    }

    renameDescribe(name: string) {
        this.utils.ts.selectNode(this.utils.ts.replaceNode(this.getClosestDescribeDescription(), ts.createStringLiteral(name)));
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

        const body = queries.closestDescribeArrowFunctionBody.singleNode(this.utils.ts.node) as ts.Block;

        this.utils.ts.transformNode(body, (node: ts.Block) => {
            return ts.updateBlock(node, [...node.statements, newIt])
        })
    }
}
