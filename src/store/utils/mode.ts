import {EditorAutocompleteOption, EditorState} from "@/store/types";

export interface EditorMode {
    focus: boolean;
    filter?: string;
}

export interface ModeArg {
    options: EditorAutocompleteOption[]
    callback: (key: string) => void;
}


export const mode: Record<string, EditorMode> = {
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
    constructor(private readonly state: EditorState) {
    }

    setMode(mode: EditorMode, modeArg?: ModeArg) {
        this.state.mode = mode;
        this.state.inputFocused = mode.focus;
        if (mode.filter !== undefined) {
            this.state.filter = mode.filter;
        }

        // TODO: There should be a better way?
        this.state.modeArg = modeArg;
    }

    getConfig(): ModeArg {
        return this.state.modeArg;
    }

    is(mode: EditorMode) {
        return this.state.mode === mode;
    }
}
