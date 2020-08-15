import Vuex from 'vuex';

import $ from 'jquery';
import {cleanUpHtml, importNode} from "@/store/helpers";
import {editorActions} from "@/store/actions";
import {getField, updateField} from 'vuex-map-fields';
import {mode} from "@/store/utils/mode";

export const fileTypes = {
    JAVASCRIPT: 'JAVASCRIPT',
    TYPESCRIPT: 'TYPESCRIPT',
    HTML: 'HTML',
};

const extensionToType = {
    js: fileTypes.JAVASCRIPT,
    ts: fileTypes.TYPESCRIPT,
    html: fileTypes.HTML,
};

function getInitialState() {
    return {
        mode: mode.NORMAL,
        inputFocused: false,
        modeArg: {},
        filter: '',

        selectedFileName: 'index.html',
        files: {
            'index.ts': {code: ``},
            'index.html': {
                code: '<root id = root>',
                selectedNodeKey: 'root',
            }, 'banan.html': {
                type: 'html',
                code: '<root id = root>',
                selectedNodeKey: 'root',
            },
        }
    };
}

export function getStore() {
    return new Vuex.Store({
        state: getInitialState(),
        mutations: {
            async executeAction(state, action) {
                editorActions.execute(action, state);
            },
            updateFilter(state, filter) {
                state.filter = filter;
            },
            selectFileName(state, selectedFileName) {
                state.selectedFileName = selectedFileName;
            },
            updateField,
        },
        getters: {
            getField,
            filter(state) {
                console.log(state.filter);
                return state.filter;
            },
            selectedFile(state) {
                return state.files[state.selectedFileName];
            },
            tree(state, {selectedFile, selectedFileType}) {

                if (selectedFileType === fileTypes.HTML) {
                    return importNode($(selectedFile.code)[0], selectedFile.selectedNodeKey);
                }
            },
            html(state, {selectedFile}) {
                return cleanUpHtml(selectedFile.code);
            },
            selectedFileType(state) {
                return extensionToType[state.selectedFileName.match(/\.(\w+)$/)[1]];
            },
            files(state) {
                return Object.entries(state.files).map(([name, file]) => {
                    return {name, ...file, selected: state.selectedFileName === name}
                })
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
