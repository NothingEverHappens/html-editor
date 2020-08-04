import Vuex from 'vuex';
import {foldNode} from "@/store/tree";
import {editorActions} from "@/store/actions";
import {createNode} from "@/store/helpers";



function getInitialState() {
    const key = 'root';

    return {
        nodes: {
            [key]: createNode({
                key,
                tag: 'root',
            }),
        },
        selectedNodeKey: key,
        mode: 'node',
    }
}

export function getStore() {
    return new Vuex.Store({
        state: getInitialState(),
        mutations: {
            ...editorActions.getActionsHandlers(),
        },
        getters: {
            tree(state) {
                return foldNode(state.nodes['root'], state.nodes, state.selectedNodeKey);
            }
        }
    });
}
