import {mode} from "@/store/utils/mode";
import {predicates} from "@/store/predicates";
import {EditorAction} from "@/store/types";

export const metaEditorActions: EditorAction[]  = [
    {
        key: 'Back to normal mode',
        mode: '*',
        displayPredicate: predicates.not(predicates.isMode(mode.NORMAL)),
        shortcut: 'Escape',
        handler(utils) {
            utils.mode.setMode(mode.NORMAL);
        }
    },
];
