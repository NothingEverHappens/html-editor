import {modes} from "@/store/utils/modes";

export const metaEditorActions = [
    {
        key: 'Back to normal mode',
        mode: '*',
        displayPredicate(state) {
            return state.mode !== modes.NORMAL;
        },
        shortcut: 'Escape',
        handler(state) {
            state.mode = modes.NORMAL;
        }
    },

];
