import {modes} from "@/store/utils/modes";


export class EditorInput {
    constructor(state, utils) {
        this.state = state;
        this.utils = utils;
    }

    getText(defaultValue = '') {
        return new Promise((resolve) => {
                const mode = this.state.mode;
                const modeArg = this.state.modeArg;
                this.state.filter = defaultValue;
                this.utils.modes.setMode(modes.UPDATE_CONTENT, (text) => {
                    this.utils.modes.setMode(mode, modeArg);
                    resolve(text);
                });
            }
        )
    }
}
