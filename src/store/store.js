import Vuex from 'vuex';

import $ from 'jquery';
import {importNode} from "@/store/helpers";
import {editorActions} from "@/store/actions";

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
            executeAction(state, action) {
                editorActions.execute(action, state);
            }
        },
        getters: {
            tree(state) {
                return importNode($(state.node)[0], state.selectedNodeKey);
            }
        }
    });
}
