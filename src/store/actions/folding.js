import {findCurrentNode, findRootNode} from "@/store/helpers";

export const foldingEditorActions = [
    {
        key: 'fold',
        shortcut: 'f',
        handler(state) {
            const node = findCurrentNode(state);
            node.attr('meta-folded', node.attr('meta-folded') === 'true' ? 'false' : true);
            state.node = findRootNode(node)[0].outerHTML;
        }
    },

];
