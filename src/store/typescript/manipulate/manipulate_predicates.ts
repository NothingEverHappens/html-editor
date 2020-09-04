import {EditorUtils} from "@/store/utils/utils";

export const manipulatePredicates = {
    isPartOfAList(utils: EditorUtils) {
        return utils.ts.node.parent && !!utils.ts.getContainingArrayPropName()
    }
};
