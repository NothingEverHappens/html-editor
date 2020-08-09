import {modes} from "@/store/utils/modes";
import {predicates} from "@/store/predicates";

export const metaEditorActions = [
    {
        key: 'Back to normal mode',
        mode: '*',
        displayPredicate: predicates.not(predicates.isMode(modes.NORMAL)),
        shortcut: 'Escape',
        handler(utils) {
            utils.modes.setMode(modes.NORMAL);
        }
    },

];
