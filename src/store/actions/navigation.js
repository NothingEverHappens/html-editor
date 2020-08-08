import {findCurrentNode} from "@/store/helpers";
import {predicates} from "@/store/predicates";

export const navigationEditorActions = [
    {
        displayPredicate: predicates.not(predicates.isText),
        key: 'goChild',
        shortcut: ['ArrowRight', 'l'],
        handler(state, utils) {
            utils.goChild();
        }
    },
    {
        key: 'goParent',
        shortcut: ['ArrowLeft', 'h'],
        displayPredicate: predicates.not(predicates.isRoot),
        handler(state) {
            const node = findCurrentNode(state);

            const parentId = node.parent().attr('id');
            if (parentId) {
                state.selectedNodeKey = parentId;
            }
        }
    },
    {
        key: 'goNext',
        shortcut: ['ArrowDown', 'j'],
        handler(state, utils) {
            utils.goNext();
        }
    },
    {
        key: 'goPrevious',
        shortcut: ['ArrowUp', 'k'],
        handler(state, utils) {
            utils.goPrevious();
        }
    }
];
