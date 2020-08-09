import Vuex from 'vuex';

import $ from 'jquery';
import {cleanUpHtml, importNode} from "@/store/helpers";
import {editorActions} from "@/store/actions";
import {getField, updateField} from 'vuex-map-fields';
import {mode} from "@/store/utils/mode";

function getInitialState() {
    return {
        node: '<root id = root>',
        selectedNodeKey: 'root',
        mode: mode.NORMAL,
        inputFocused: false,
        modeArg: {},
        filter: '',
    }
}

export function getStore() {
    return new Vuex.Store({
        state: getInitialState(),
        mutations: {
            executeAction(state, action) {
                editorActions.execute(action, state);
            },
            updateFilter(state, filter) {
                state.filter = filter;
            },
            updateField,
        },
        getters: {
            getField,
            filter(state) {
                console.log(state.filter);
                return state.filter;
            },
            tree(state) {
                return importNode($(state.node)[0], state.selectedNodeKey);
            },
            html(state) {
                return cleanUpHtml(state.node);
            },
            state(state) {
                return state;
            },
            inputFocused(state) {
                return state.inputFocused;
            },
        }
    });
}
