import {EditorAction} from "@/store/types";

export const foldingEditorActions: EditorAction[] = [
    {
        key: 'fold',
        shortcut: 'f',
        handler(utils) {
            utils.attributes.flipAttribute('data-editor-meta-folded');
        }
    },
];
