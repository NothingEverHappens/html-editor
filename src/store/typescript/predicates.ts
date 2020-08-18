import {kindMap} from "@/components/editors/ts/components/kindMap";
import ts from 'typescript';
import {EditorUtils} from "@/store/utils/utils";

export const tsPredicates = {
    nodeKind(kinds: string[]) {
        kinds = ([] as string[]).concat(kinds);
        return (utils: EditorUtils) => {
            const kind = kindMap[utils.ts.node.kind];
            return kinds.includes(kind)
        }
    }

};
