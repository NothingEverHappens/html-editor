import {modes} from "@/store/utils/modes";


export class EditorInput {
    constructor(state, utils) {
        this.state = state;
        this.utils = utils;
    }

    get value() {
        return this.state.filter;
    }

    getText(defaultValue = '', options) {
        return new Promise((resolve) => {
                const mode = this.state.mode;
                const modeArg = this.state.modeArg;
                this.state.filter = defaultValue;
                this.utils.modes.setMode(modes.UPDATE_CONTENT, {
                    options,
                    callback: (text) => {
                        this.utils.modes.setMode(mode, modeArg);
                        resolve(text);
                    }
                });
            }
        )
    }
}
