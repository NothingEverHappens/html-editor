import {EditorAutocompleteOption, EditorState} from "@/store/types";

export interface EditorMode {
    type: 'NORMAL' | 'UPDATE_CONTENT' | 'JASMINE' | 'JUMP';
    focus: boolean;
    filter?: string;
}

export interface ModeArg {
    options: EditorAutocompleteOption[]
    callback: (key: string) => void;
}

export const mode: Record<string, EditorMode> = {
    NORMAL: {
        type: 'NORMAL',
        focus: false,
        filter: '',
    },
    UPDATE_CONTENT: {
        type: 'UPDATE_CONTENT',
        focus: true,
    },
    JASMINE: {
        type: 'JASMINE',
        focus: false,
    },
    JUMP: {
        type: 'JUMP',
        focus: false,
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
