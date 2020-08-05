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
        handler(state) {
            const node = findCurrentNode(state);

            const nextId = getFirstExisting(
                node.children(),
                node.next(),
                node.parents().filter((_, el) => el.nextSibling).next(),
            ).attr('id');


            if (nextId) {
                state.selectedNodeKey = nextId;
            }
        }
    },
    {
        key: 'goPrevious',
        shortcut: 'ArrowUp',
        handler(state) {
            const node = findCurrentNode(state);

            const prevId = getFirstExisting(
                node.prev().filter(':parent').find('*').last(),
                node.prev(),
                node.parent()
            ).attr('id');

            if (prevId) {
                state.selectedNodeKey = prevId;
            }
        }
    }
];
