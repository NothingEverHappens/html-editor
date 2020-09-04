import ts from 'typescript';
import {EditorUtils} from "@/store/utils/utils";

export const tsPredicates = {
    nodeKind(...kinds: ts.SyntaxKind[]) {
        return (utils: EditorUtils) => {
            return kinds.includes(utils.ts.node.kind)
        }
    }
};
