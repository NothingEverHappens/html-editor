import {navigationEditorActions} from "@/store/actions/navigation";
import {nodeManipulationEditorActions} from "@/store/actions/nodeManipulation";
import {foldingEditorActions} from "@/store/actions/folding";
import {EditorUtils} from "@/store/utils/utils";
import {metaEditorActions} from "@/store/actions/meta";
import {modes} from "@/store/utils/modes";

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

        a.handler.call(a, state, utils);
    }

    getActions(state, filter) {
        return this.actions.flatMap(a => {
            if (typeof a.generator === 'function') {
                return (a.generator(state, filter));
            }
            return a;
        }).map(a => {
            return {displayShortcut: getDisplayShortcut(a.shortcut), ...a};
        })
            .filter(a=>{
                return !filter || a.key.toLowerCase().includes(filter.toLocaleString());
            })
            .filter(a => {
                const matchesPredicate = typeof a.displayPredicate !== 'function' ||
                    a.displayPredicate(state, new EditorUtils(state));

                const matchesMode = a.mode === '*' || (a.mode || modes.NORMAL) === state.mode;
                return matchesPredicate && matchesMode;
            });
    }
}

export const editorActions = new Actions();

editorActions.addActions(navigationEditorActions);
editorActions.addActions(nodeManipulationEditorActions);
editorActions.addActions(foldingEditorActions);
editorActions.addActions(metaEditorActions);

