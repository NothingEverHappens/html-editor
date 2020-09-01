import {EditorAction} from "@/store/types";
import {mode} from "@/store/utils/mode";

export const jasmineEditorActions: EditorAction[] = [
    {
        key: 'jasmine',
        shortcut: 'g',
        type: '*',
        mode: mode.NORMAL,
        handler(utils) {
            utils.mode.setMode(mode.JASMINE);
        }
    },
    {
        key: 'add describe',
        shortcut: 'd',
        type: '*',
        mode: mode.JASMINE,
        handler(utils) {
            utils.ts.jasmine.addDescribe();
        }
    },
    {
        key: 'exit jasmine',
        shortcut: 'Escape',
        type: '*',
        mode: mode.JASMINE,
        handler(utils) {
            utils.mode.setMode(mode.NORMAL);
        }
    },
];
