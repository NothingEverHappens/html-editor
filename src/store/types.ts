import ts, {SourceFile} from 'typescript';
import {EditorMode} from './utils/mode';
import {EditorUtils} from "@/store/utils/utils";


export type DisplayPredicate = (utils: EditorUtils) => boolean;


export interface EditorActionDefinition {
    key: ((utils: EditorUtils) => string) | string;
    type?: string;
    shortcut: string | string[];
    mode?: EditorMode | '*';
    displayPredicate?: DisplayPredicate,
    handler: (this: EditorAction, utils: EditorUtils, action: any, param?: any) => void;
}

export interface EditorActionGenerator {
    type?: string;
    mode?: EditorMode;
    displayPredicate?: DisplayPredicate,
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
}

export interface TsFile {
    type: 'ts',
    tree: SourceFile,
    selectedNode: ts.Node
}


type  EditorFile = HtmlFile | TsFile;

export interface EditorState {
    mode: EditorMode,
    inputFocused: boolean;
    /** @deprecated */
    modeArg: any;
    filter: string;
    selectedFileName: string;
    files: Record<string, EditorFile>

}
