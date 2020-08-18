import {EditorUtils} from "@/store/utils/utils";
import {DisplayPredicate} from "@/store/types";
import {EditorMode} from "@/store/utils/mode";


function and(predicate: DisplayPredicate, predicate2: DisplayPredicate) {
    return (utils: EditorUtils) => predicate(utils) && predicate2(utils)
}

function not(predicate: DisplayPredicate) {
    return (utils: EditorUtils) => !predicate(utils);
}

function isText(utils: EditorUtils) {
    return utils.isText()
}

function isRoot(utils: EditorUtils) {
    return utils.isRoot()
}

export const predicates = {
    isRoot,
    isText,
    hasFilter(utils: EditorUtils) {
        return utils.state.filter !== '';
    },
    not,
    and,
    isMode(mode: EditorMode) {
        return (utils: EditorUtils) => utils.mode.is(mode);
    },
    isNode: and(
        not(isText),
        not(isRoot),
    ),
};
