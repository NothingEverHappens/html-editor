import {modes} from "@/store/utils/modes";
import {predicates} from "@/store/predicates";

export const inputActions = [
    {
        mode: modes.UPDATE_CONTENT,
        generator(utils) {
            const config = utils.modes.getConfig();

            if (!config?.options) {
                return [];
            }

            function handler() {
                config.callback(this.key);
            }

            return config.options.map((option, shortcut) => {
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
        handler(utils) {
            const config = utils.modes.getConfig();
            console.assert(typeof config.callback === 'function');
            config.callback(utils.input.value);
            utils.modes.setMode(modes.NORMAL);
        }
    }
];
