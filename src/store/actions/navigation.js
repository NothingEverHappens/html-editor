import {findCurrentNode, getFirstExisting} from "@/store/helpers";

export const navigationEditorActions = [
    {
        key: 'goChild',
        shortcut: 'ArrowRight',
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
        shortcut: 'ArrowLeft',
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
        shortcut: 'ArrowDown',
        handler(state, utils) {
            utils.goNext();
        }
    },
    {
        key: 'goPrevious',
        shortcut: 'ArrowUp',
        handler(state, utils) {
            utils.goPrevious();
        }
    }
];
