import Vuex from 'vuex';
import {editorActions} from "@/store/actions";

import $ from 'jquery';
import {importNode} from "@/store/helpers";

function getInitialState() {
    return {
        node: '<root id = root>',
        selectedNodeKey: 'root',
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
                return importNode($(state.node)[0], state.selectedNodeKey);
            }
        }
    });
}
