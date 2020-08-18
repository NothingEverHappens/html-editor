import {predicates} from "@/store/predicates";
import {EditorUtils} from "@/store/utils/utils";

export const navigationEditorActions = [
    {
        displayPredicate: predicates.not(predicates.isText),
        key: 'goChild',
        shortcut: ['ArrowRight', 'l'],
        handler(utils: EditorUtils) {
            utils.goChild();
        }
    },
    {
        key: 'goParent',
        shortcut: ['ArrowLeft', 'h'],
        displayPredicate: predicates.not(predicates.isRoot),
        handler(utils: EditorUtils) {
            utils.goParent();
        }
    },
    {
        key: 'goNext',
        shortcut: ['ArrowDown', 'j'],
        handler(utils: EditorUtils) {
            utils.goNext();
        }
    },
    {
        key: 'goPrevious',
        shortcut: ['ArrowUp', 'k'],
        handler(utils: EditorUtils) {
            utils.goPrevious();
        }
    }
];
