import {kindMap} from "@/components/editors/ts/components/kindMap";
import ts from 'typescript';
import {EditorUtils} from "@/store/utils/utils";
import {Tsq} from "@/tsools/query";

export const jumpPredicates = {
    documentContainsNode(query: Tsq) {
        return (utils: EditorUtils) => {
            // eslint-disable-next-line no-debugger
            return query.fromNode(utils.ts.tree).length > 0;
        }
    }
};
