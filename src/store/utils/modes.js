export const modes = {
    NORMAL: {
        focus: false,
    },
    SELECT_TAG_NAME: {
        focus: true
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
        // TODO: There should be a better way?
        this.state.modeArg = modeArg;
    }

}
