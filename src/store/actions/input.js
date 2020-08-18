import {mode} from "@/store/utils/mode";
import {predicates} from "@/store/predicates";

export const inputActions = [
    {
        mode: mode.UPDATE_CONTENT,
        generator(utils) {
            const config = utils.mode.getConfig();

            if (!config?.options) {
                return [];
            }

            function handler() {
                config.callback(this.key);
            }


            return config.options
                .filter(option => option.key !== utils.input.value)
                .filter(option => option.key.toLowerCase().includes(utils.state.filter.toLowerCase()))
                .map((option, shortcut) => {
                        return {
                            key: option.key,
                            type: '*',
                            meta: 'used ' + option.used + ' times',
                            shortcut: '^' + shortcut.toString(),
                            mode: mode.UPDATE_CONTENT,
                            handler
                        };
                    }
                ).slice(0, 10)
        }
    },
    {
        key: (utils) => utils.input.value,
        displayPredicate: predicates.hasFilter,
        shortcut: 'Enter',
        type: '*',
        mode: mode.UPDATE_CONTENT,
        handler(utils) {
            const config = utils.mode.getConfig();
            console.assert(typeof config.callback === 'function');
            config.callback(utils.input.value);
            utils.mode.setMode(mode.NORMAL);
        }
    }
];
