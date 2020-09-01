import ts from "typescript";


export function tsAstRename(sourceFile: ts.SourceFile, from: string, to: string) {
    const transformer = <T extends ts.Node>(context: ts.TransformationContext) => (rootNode: T) => {
        function visit(node: ts.Node): ts.Node {
            node = ts.visitEachChild(node, visit, context);
            if (node.kind === ts.SyntaxKind.Identifier && (node as ts.Identifier).text === from) {
                return ts.createIdentifier(to);
            }
            return node;
        }

        return ts.visitNode(rootNode, visit);
    };

    const result: ts.TransformationResult<ts.SourceFile> = ts.transform<ts.SourceFile>(
        sourceFile, [transformer]
    );

    return result.transformed[0]
}


export function tsAstAddDescribe(sourceFile: ts.SourceFile, from: string, to: string) {
    const transformer = <T extends ts.Node>(context: ts.TransformationContext) => (rootNode: T) => {
        function visit(node: ts.Node): ts.Node {
            node = ts.visitEachChild(node, visit, context);
            if (node.kind === ts.SyntaxKind.Identifier && (node as ts.Identifier).text === from) {
                return ts.createIdentifier(to);
            }
            return node;
        }

        return ts.visitNode(rootNode, visit);
    };

    const result: ts.TransformationResult<ts.SourceFile> = ts.transform<ts.SourceFile>(
        sourceFile, [transformer]
    );

    return result.transformed[0]
}

export function transformVisit(sourceFile: ts.SourceFile, callback: (node: ts.Node, context: ts.TransformationContext) => ts.Node) {
    const transformer = <T extends ts.Node>(context: ts.TransformationContext) => (rootNode: T) => {
        function visit(node: ts.Node): ts.Node {
            node = ts.visitEachChild(node, visit, context);
            return callback(node, context);
        }

        return ts.visitNode(rootNode, visit);
    };

    const result: ts.TransformationResult<ts.SourceFile> = ts.transform<ts.SourceFile>(
        sourceFile, [transformer]
    );

    return result.transformed[0]
}

