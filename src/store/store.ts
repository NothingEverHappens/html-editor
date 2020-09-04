import Vuex, {Store} from 'vuex';

import $ from 'jquery';
import {cleanUpHtml, importHtml, importNode} from "@/store/helpers";
import {editorActions} from "@/store/actions";
import {getField, updateField} from 'vuex-map-fields';
import {mode} from "@/store/utils/mode";
import {parseTypeScriptFile} from "@/store/typescript/utils";
import {EditorState, TsFile} from "@/store/types";
import ts from 'typescript';

export const fileTypes = {
    JAVASCRIPT: 'JAVASCRIPT',
    TYPESCRIPT: 'TYPESCRIPT',
    HTML: 'HTML',
};

export enum Panel {
    ACTIONS_PANEL = 1,
    CODE
}

export const extensionToType: Record<string, string> = {
    js: fileTypes.JAVASCRIPT,
    ts: fileTypes.TYPESCRIPT,
    tsx: fileTypes.TYPESCRIPT,
    html: fileTypes.HTML,
};

const tree = parseTypeScriptFile(` 
 const x = 0;
  `,
    'file.ts'
);

function getInitialState(): EditorState {
    return {
        mode: mode.NORMAL,
        inputFocused: false,
        modeArg: {},
        filter: '',
        languageService: undefined,

        selectedFileName: 'index.ts',
        files: {
            'index.ts': {
                path: 'index.ts',
                code: '',
                type: 'ts',
                tree,
                selectedNode: tree,
                selectableNodes: [],
            },
            'index.html': {
                type: 'html',
                path: 'index.html',
                code: '<root id = root>',
                selectedNodeKey: 'root',
            },
            'banan.html': {
                type: 'html',
                path: 'banan.html',
                code: importHtml(`<root id = root><div></div></root>`),
                selectedNodeKey: 'root',
            },
        }
    };
}


export function getStore() {
    const store: Store<EditorState> = new Vuex.Store({
        state: getInitialState(),
        actions: {
            async fetchFiles() {
                const files = await fetch('/files');
                const result = await files.json();
                this.commit('updateFileList', result);
            },
        },
        mutations: {
            updateFileList(state, files: TsFile[]) {
                state.files = files.reduce((result, file) => {
                    result[file.path] = {
                        ...file,
                        tree: parseTypeScriptFile(file.code, file.path)
                    };
                    return result;
                }, {} as Record<string, TsFile>);

                // state.languageService = initLanguageService(files);
                state.selectedFileName = 'store/utils/input.ts';
                // files[0].path;
                //files.find(f=>f.path.includes('AddUserDialog.test.tsx'))!.path;
            },
            async executeAction(state, action) {
                return editorActions.execute(action, state, store);
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

                if (selectedFileType === fileTypes.TYPESCRIPT) {
                    return selectedFile.tree;
                }
            },
            selectedNode(state, {selectedFile}) {
                return selectedFile.selectedNode;
            },
            selectableNodes(state, {selectedFile}) {
                const entries = (selectedFile.selectableNodes || []).map((value: ts.Node, key: number) => ([value, key.toString()]));
                return new WeakMap(entries);

            },
            html(state, {selectedFile, selectedFileType}) {
                if (selectedFileType === fileTypes.HTML) {
                    return cleanUpHtml(selectedFile.code);
                }
                return '';
            },
            selectedFileType(state) {
                return extensionToType[state.selectedFileName.match(/\.(\w+)$/)![1]];
            },
            selectedFileName(state) {
                return state.selectedFileName;
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
            }
        }
    });
    return store;
}
