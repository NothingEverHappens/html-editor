import {predicates} from "@/store/predicates";

export const navigationEditorActions = [
    {
        displayPredicate: predicates.not(predicates.isText),
        key: 'goChild',
        shortcut: ['ArrowRight', 'l'],
        handler(utils) {
            utils.goChild();
        }
    },
    {
        key: 'goParent',
        shortcut: ['ArrowLeft', 'h'],
        displayPredicate: predicates.not(predicates.isRoot),
        handler(utils) {
            utils.goParent();
        }
    },
    {
        key: 'goNext',
        shortcut: ['ArrowDown', 'j'],
        handler(utils) {
            utils.goNext();
        }
    },
    {
        key: 'goPrevious',
        shortcut: ['ArrowUp', 'k'],
        handler(utils) {
            utils.goPrevious();
        }
    }
];
