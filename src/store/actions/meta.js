import {mode} from "@/store/utils/mode";
import {predicates} from "@/store/predicates";

export const metaEditorActions = [
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
