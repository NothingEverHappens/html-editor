export const foldingEditorActions = [
    {
        key: 'fold',
        shortcut: 'f',
        handler(state) {
            const currentNode = state.nodes[state.selectedNodeKey];
            currentNode.folded = !currentNode.folded;
        }
    },

];
