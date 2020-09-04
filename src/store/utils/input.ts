import {mode} from "@/store/utils/mode";
import {EditorAutocompleteOption, EditorState} from "@/store/types";
import {EditorUtils} from "@/store/utils/utils";


export class EditorInput {

    constructor(private readonly state: EditorState,
                private readonly utils: EditorUtils) {
    }

    get value() {
        return this.state.filter;
    }

    getText(defaultValue = '', options: EditorAutocompleteOption[] = []): Promise<string> {
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
