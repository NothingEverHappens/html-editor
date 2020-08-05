import {createNode, findCurrentNode, findRootNode, uniqueKey} from "@/store/helpers";

export const nodeManipulationEditorActions = [
    {
        key: 'wrap',
        shortcut: 'w',
        handler(state, value = {}) {
            const node = findCurrentNode(state);
            node.wrap(createNode());
            state.node = findRootNode(node)[0].outerHTML;
        }
    },
    {
        key: 'addChild',
        shortcut: 'd',
        handler(state, value = {}) {
            const el = document.createElement('div');
            el.setAttribute('id', uniqueKey());

            let root = findCurrentNode(state).append(el);

            state.node = findRootNode(root)[0].outerHTML;
        }
    },
    {
        key: 'setAttribute',
        shortcut: 'a',
        handler(state) {


        }
    },
    {
        key: 'updateTagName',
        shortcut: 'a',
        handler(state, tag) {

        }
    },
    {
        key: 'deleteNode',
        shortcut: 'Backspace',
        handler(state) {
            const node = findCurrentNode(state);

            if (node.attr('id') === 'root') {
                return;
            }

            const parent = node.parent();
            node.remove();


            state.node = findRootNode(parent)[0].outerHTML;
        }
    },

];
