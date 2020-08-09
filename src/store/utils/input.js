import {mode} from "@/store/utils/mode";


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
                const previousMode = this.state.mode;
                const modeArg = this.state.modeArg;
                this.state.filter = defaultValue;
                this.utils.mode.setMode(mode.UPDATE_CONTENT, {
                    options,
                    callback: (text) => {
                        this.utils.mode.setMode(previousMode, modeArg);
                        resolve(text);
                    }
                });
            }
        )
    }
}
