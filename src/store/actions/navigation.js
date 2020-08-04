export const navigationEditorActions = [
    {
        key: 'goChild',
        shortcut: 'ArrowRight',
        handler(state) {
            const currentNode = state.nodes[state.selectedNodeKey];

            if (currentNode.firstChild) {
                state.selectedNodeKey = currentNode.firstChild;
            }
        }
    },
    {
        key: 'goParent',
        shortcut: 'ArrowLeft',
        handler(state) {
            const currentNode = state.nodes[state.selectedNodeKey];

            if (currentNode.parent) {
                state.selectedNodeKey = currentNode.parent;
            }
        }
    },
    {
        key: 'goNext',
        shortcut: 'ArrowDown',
        handler(state) {
            const currentNode = state.nodes[state.selectedNodeKey];

            if (currentNode.firstChild) {
                state.selectedNodeKey = currentNode.firstChild;
                return;
            }

            if (currentNode.nextSibling) {
                state.selectedNodeKey = currentNode.nextSibling;
                return;
            }

            let key = state.selectedNodeKey;

            while (key) {
                const node = state.nodes[key];
                key = node.parent;
                if (node.nextSibling) {
                    state.selectedNodeKey = node.nextSibling;
                    return;
                }
            }
        }
    },
    {
        key: 'goPrevious',
        shortcut: 'ArrowUp',
        handler(state) {
            const currentNode = state.nodes[state.selectedNodeKey];
            if (currentNode.previousSibling) {
                state.selectedNodeKey = currentNode.previousSibling;

                let key = currentNode.previousSibling;

                while (key) {
                    const node = state.nodes[key];
                    state.selectedNodeKey = key;
                    key = node.lastChild;
                }
                return;
            }

            this.commit('goParent');
        }
    }
];
