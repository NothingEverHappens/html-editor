import {findCurrentNode, getFirstExisting} from "@/store/helpers";

export const navigationEditorActions = [
    {
        key: 'goChild',
        shortcut: ['ArrowRight', 'l'],
        handler(state) {
            const node = findCurrentNode(state);

            const parentId = node.children().attr('id');
            if (parentId) {
                state.selectedNodeKey = parentId;
            }
        }
    },
    {
        key: 'goParent',
        shortcut: ['ArrowLeft', 'h'],
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
