import {createNode, uniqueKey} from "@/store/helpers";
import Vue from 'vue'
import {getAllKeys} from "@/store/tree";

export const nodeManipulationEditorActions = [
    {
        key: 'wrap',
        shortcut: 'w',
        handler(state, value = {}) {
            const key = uniqueKey();
            const node = state.nodes[state.selectedNodeKey];
            const parent = state.nodes[node.parent];

            const newNode = createNode({
                parent: parent.key,
                nextSibling: node.nextSibling,
                previousSibling: node.previousSibling,
                firstChild: state.selectedNodeKey,
                lastChild: state.selectedNodeKey,
                key,
                tag: 'div',
                ...value,
            });

            if (node.nextSibling) {
                state.nodes[node.nextSibling].previousSibling = key;
                node.nextSibling = null;
            }

            if (node.previousSibling) {
                state.nodes[node.previousSibling].nextSibling = key;
                node.previousSibling = null;
            }

            if (parent) {
                if (parent.firstChild === state.selectedNodeKey) {
                    parent.firstChild = key;
                }

                if (parent.lastChild === state.selectedNodeKey) {
                    parent.lastChild = key;
                }
            }

            node.parent = key;

            Vue.set(state.nodes, key, newNode);

        }
    },
    {
        key: 'addChild',
        shortcut: 'd',
        handler(state, value = {}) {
            const key = uniqueKey();
            const parent = state.nodes[state.selectedNodeKey];

            const newNode = createNode({
                parent: parent.key,
                key,
                tag: 'div',
                ...value,
            });

            if (!parent.lastChild) {
                parent.firstChild = key;
            } else {
                state.nodes[parent.lastChild].nextSibling = key;
                newNode.previousSibling = parent.lastChild;
            }
            parent.lastChild = key;

            Vue.set(state.nodes, key, newNode);

        }
    },
    {
        key: 'setAttribute',
        shortcut: 'a',
        handler(state) {
            const node = state.nodes[state.selectedNodeKey];
            node.attributes.push({
                name: '*ngFor',
                value: 'let x of y'
            });
        }
    },
    {
        key: 'updateTagName',
        shortcut: 'a',
        handler(state, tag) {
            const node = state.nodes[state.selectedNodeKey];
            node.tag = tag;
        }
    },
    {
        key: 'deleteNode',
        shortcut: 'Backspace',
        handler(state) {
            const node = state.nodes[state.selectedNodeKey];

            const parent = state.nodes[state.nodes[state.selectedNodeKey].parent];

            if (!parent) {
                return;
            }

            if (node.nextSibling) {
                state.nodes[node.nextSibling].previousSibling = node.previousSibling;
            }

            if (node.previousSibling) {
                state.nodes[node.previousSibling].nextSibling = node.nextSibling;
            }

            if (parent.firstChild === state.selectedNodeKey) {
                parent.firstChild = node.nextSibling;
            }

            if (parent.lastChild === state.selectedNodeKey) {
                parent.lastChild = node.previous;
            }

            for (const key of getAllKeys(node.key, state.nodes)) {
                console.log(key);
                delete state.nodes[key];
            }

            delete state.nodes[state.selectedNodeKey];
            state.selectedNodeKey = parent.key;

        }
    },

];
