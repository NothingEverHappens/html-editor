import {navigationEditorActions} from "@/store/actions/navigation";
import {nodeManipulationEditorActions} from "@/store/actions/nodeManipulation";
import {foldingEditorActions} from "@/store/actions/folding";
import {EditorUtils} from "@/store/utils/utils";
import {metaEditorActions} from "@/store/actions/meta";
import {mode} from "@/store/utils/mode";
import {inputActions} from "@/store/actions/input";

function getDisplayShortcut(shortcut) {
    const map = {
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
    actions = [];

    addAction(action) {
        this.actions.push(action);
    }

    addActions(actions) {
        actions.forEach(a => this.addAction(a))
    }

    execute(action, state) {
        const utils = new EditorUtils(state);
        const a = this.getActions(state).find(a => a.key === action.type);

        if (!a) {
            throw new Error('action does not exist: ' + action.type);
        }

        console.assert(a.handler, 'action ' + a.key + ' is missing a handler');

        a.handler.call(a, utils);
    }

    getActions(state, filter) {
        const utils = new EditorUtils(state);
        return this.actions.flatMap(a => {
            if (typeof a.generator === 'function') {
                return (a.generator(utils, filter));
            }
            return a;
        }).map(a => {
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
                const matchesPredicate = typeof a.displayPredicate !== 'function' ||
                    a.displayPredicate(utils);

                const matchesMode = a.mode === '*' || (a.mode || mode.NORMAL) === state.mode;
                return matchesPredicate && matchesMode;
            });
    }
}

export const editorActions = new Actions();

editorActions.addActions(navigationEditorActions);
editorActions.addActions(nodeManipulationEditorActions);
editorActions.addActions(foldingEditorActions);
editorActions.addActions(metaEditorActions);
editorActions.addActions(inputActions);

