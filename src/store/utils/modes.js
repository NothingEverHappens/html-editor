export const modes = {
    NORMAL: {
        focus: false,
        filter: '',
    },
    SELECT_TAG_NAME: {
        focus: true,
    },
    UPDATE_CONTENT: {
        focus: true,
    },
};

export class EditorModes {
    constructor(state) {
        this.state = state;
    }

    setMode(mode, modeArg) {
        this.state.mode = mode;
        this.state.inputFocused = mode.focus;
        if(mode.filter !== undefined){
            this.state.filter = mode.filter;
        }
        // TODO: There should be a better way?
        this.state.modeArg = modeArg;
    }

    getConfig(){
        return this.state.modeArg;
    }

}
