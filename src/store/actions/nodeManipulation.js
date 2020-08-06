import {createNode, findCurrentNode, findRootNode, uniqueKey} from "@/store/helpers";

export const nodeManipulationEditorActions = [
    {
        key: 'wrap',
        shortcut: 'w',
        handler(state) {
            const node = findCurrentNode(state);
            node.wrap(createNode());
            state.node = findRootNode(node)[0].outerHTML;
        }
    },
    {
        key: 'addChild',
        shortcut: 'd',
        handler(state) {
            const el = document.createElement('div');
            el.setAttribute('id', uniqueKey());

            let root = findCurrentNode(state).append(el);

            state.node = findRootNode(root)[0].outerHTML;
        }
    },
    {
        key: 'setAttribute',
        shortcut: 'a',
        handler() {


        }
    },
    {
        key: 'updateTagName',
        shortcut: 'a',
        handler(state, utils) {
            utils.updateTagName(utils);
        }
    },
    {
        key: 'deleteNode',
        shortcut: 'Backspace',
        handler(state, utils) {
            const node = findCurrentNode(state);

            if (node.attr('id') === 'root') {
                return;
            }

            if (utils.hasNextSibling()) {
                utils.goNextSibling();
            } else {
                utils.goPrevious();
            }

            const parent = node.parent();
            node.remove();

            state.node = findRootNode(parent)[0].outerHTML;
        }
    },
];
