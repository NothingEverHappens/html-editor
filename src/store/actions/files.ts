import {EditorAction} from "@/store/types";
import {mode} from "@/store/utils/mode";

export const filesEditorActions: EditorAction[] = [
    {
        key: 'open file',
        shortcut: 'o',
        mode: mode.NORMAL,
        type: '*',
        async handler(utils) {
            const files = Object.keys(utils.state.files).map(key => ({key, used: 0}));
            utils.state.selectedFileName = await utils.input.getText('', files);
        }
    },
];
