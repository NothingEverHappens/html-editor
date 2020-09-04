import {kindMap} from "@/components/editors/ts/components/kindMap";
import ts from 'typescript';
import {EditorUtils} from "@/store/utils/utils";
import {Tsq} from "@/tsools/query";

export const jasminePredicates = {
    selectedNodeMatchesQuery(query: Tsq) {
        return (utils: EditorUtils) => {
            return !!query.singleNode(utils.ts.node);
        }
    }
};
