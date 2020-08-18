import {navigationEditorActions} from "@/store/actions/navigation";
import {nodeManipulationEditorActions} from "@/store/actions/nodeManipulation";
import {foldingEditorActions} from "@/store/actions/folding";
import {EditorUtils} from "@/store/utils/utils";
import {metaEditorActions} from "@/store/actions/meta";
import {mode} from "@/store/utils/mode";
import {inputActions} from "@/store/actions/input";
import {jsActions} from "@/store/typescript/actions";
import {extensionToType, fileTypes} from "@/store/store";
import {EditorAction, EditorActionDefinition, EditorState} from "@/store/types";


function getDisplayShortcut(shortcut: string|string[]) {
    const map: Record<string, string> = {
        ArrowLeft: '⬅',
        ArrowRight: '➡',
        ArrowDown: '⬇',
        ArrowUp: '⬆',
        Backspace: '⌫',
        Escape: '⎋',
        Enter: '↩',
    };

    if (Array.isArray(shortcut)) {
        shortcut = shortcut[0]
    }

    return map[shortcut] || shortcut;
}

export class Actions {
    actions: EditorAction[] = [];

    addAction(action: EditorAction) {
        this.actions.push(action);
    }

    addActions(actions: EditorAction[]) {
        actions.forEach(a => this.addAction(a))
    }

    async execute(action: EditorActionDefinition, state: EditorState) {
        const utils = new EditorUtils(state);
        const a = this.getActions(state).find(a => a.key === action.type);

        if (!a) {
            throw new Error('action does not exist: ' + action.type);
        }

        console.assert(!!a.handler, 'action ' + a.key + ' is missing a handler');

        //
        // const inputs = {};
        // if (Array.isArray(a.inputs)) {
        //     for (const input of a.inputs) {
        //         const value = await utils.input.getText('', utils.stats.getByKey(input.key));
        //         inputs[input.key] = value;
        //         utils.stats.update(input.key, value);
        //     }
        // }

        a.handler.call(a, utils, action);
    }

    getActions(state: EditorState, filter = '') {
        const utils = new EditorUtils(state);
        return this.actions.flatMap(a => {
            if ('generator' in a && typeof a.generator === 'function') {
                return (a.generator(utils, filter));
            }
            return a as EditorActionDefinition[];
        }).map((a: EditorActionDefinition) => {
            return {
                displayShortcut: getDisplayShortcut(a.shortcut),
                ...a,
                key: typeof a.key === 'function' ? a.key(utils) : a.key,
            };
        })
            .filter(a => {
                return !filter || a.key.toLowerCase().includes(filter.toLowerCase());
            })
            .filter(a => {
                // TODO: This is the same as getter. reuse
                const type = extensionToType[state.selectedFileName.match(/\.(\w+)$/)![1]];
                // console.log(a.type, a.key, a);
                return a.type === '*' || (a.type || fileTypes.HTML) === type;
            })
            .filter(a => {
                const matchesPredicate = typeof a.displayPredicate !== 'function' ||
                    a.displayPredicate(utils);

                const matchesMode = a.mode === '*' || (a.mode || mode.NORMAL) === state.mode;
                return matchesPredicate && matchesMode;
            })

    }
}

export const editorActions = new Actions();

editorActions.addActions(navigationEditorActions);
editorActions.addActions(nodeManipulationEditorActions);
editorActions.addActions(foldingEditorActions);
editorActions.addActions(metaEditorActions);
editorActions.addActions(inputActions);
editorActions.addActions(jsActions);

