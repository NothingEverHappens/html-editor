import {modes} from "@/store/utils/modes";
import {predicates} from "@/store/predicates";

export const inputActions = [
    {
        mode: modes.UPDATE_CONTENT,
        generator(state) {
            if (!state.modeArg?.options) {
                return [];
            }

            function handler(state) {
                state.modeArg.callback(this.key);
            }

            return state.modeArg.options.map((option, shortcut) => {
                    return {
                        key: option.key,
                        meta: 'used ' + option.used + ' times',
                        shortcut: '^' + shortcut.toString(),
                        mode: modes.UPDATE_CONTENT,
                        handler
                    };
                }
            );
        }
    },
    {
        key: (state) => state.filter,
        displayPredicate: predicates.hasFilter,
        shortcut: 'Enter',
        mode: modes.UPDATE_CONTENT,
        handler(state, utils) {
            console.assert(typeof state.modeArg.callback === 'function');
            state.modeArg.callback(state.filter);
            utils.modes.setMode(modes.NORMAL);
        }
    }
];
