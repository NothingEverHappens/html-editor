import ts, {SourceFile} from 'typescript';
import {EditorMode} from './utils/mode';
import {EditorUtils} from "@/store/utils/utils";
import {LanguageService} from "@/store/typescript/initLanguageService";


export type DisplayPredicate = (utils: EditorUtils) => boolean;


interface BaseAction {
    readonly key: ((utils: EditorUtils) => string) | string;
    type?: string;
    mode?: EditorMode | '*';
    displayPredicate?: DisplayPredicate,
}

export interface EditorActionDefinition extends BaseAction {
    type?: string;
    shortcut: string | string[];
    handler: (this: EditorAction, utils: EditorUtils, action: any, param?: any) => void;
}

export interface EditorActionGenerator extends BaseAction {
    generator?: (this: EditorActionGenerator, utils: EditorUtils, filter: string) => EditorActionDefinition[]
}


export type EditorAction = EditorActionDefinition | EditorActionGenerator;

export interface EditorAutocompleteOption {
    key: string;
    used: number;
}

interface TsNode {
    a: 'lol'
}

export interface HtmlFile {
    type: 'html',
    code: string,
    selectedNodeKey: string;
    path: string;
}

export interface TsFile {
    type: 'ts',
    path: string;
    tree: SourceFile,
    selectedNode: ts.Node,
    selectableNodes: ts.Node[],
    code: string;
}


type  EditorFile = HtmlFile | TsFile;

export interface EditorState {
    languageService?: LanguageService,
    mode: EditorMode,
    inputFocused: boolean;
    /** @deprecated */
    modeArg: any;
    filter: string;
    selectedFileName: string;
    files: Record<string, EditorFile>

}
