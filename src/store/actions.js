import {navigationEditorActions} from "@/store/actions/navigation";
import {nodeManipulationEditorActions} from "@/store/actions/nodeManipulation";
import {foldingEditorActions} from "@/store/actions/folding";
import {DomUtils} from "@/store/domUtils";
import {modes} from "@/store/helpers";

function getDisplayShortcut(shortcut) {
    const map = {
        ArrowLeft: '⬅',
        ArrowRight: '➡',
        ArrowDown: '⬇',
        ArrowUp: '⬆',
        Backspace: '⌫',
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
        const utils = new DomUtils(state);
        const a = this.actions.find(a => a.key === action.type);

        if (!a) {
            throw new Error('action does not exist: ' + action.type);
        }

        a.handler.call(this, state, utils);
    }

    getActions(state) {
        console.log(state.mode);

        return this.actions.map(a => {
            if (typeof a.generator === 'function') {
                return (a.generator(state));
            }
            return {displayShortcut: getDisplayShortcut(a.shortcut), ...a};
        }).flat()
            .filter(a => {
                const matchesPredicate = typeof a.displayPredicate !== 'function' ||
                    a.displayPredicate(state, new DomUtils(state));

                const matchesMode = (a.mode || modes.NORMAL) === state.mode;
                return matchesPredicate && matchesMode;

            });
    }

    getActionsHandlers() {
        return this.actions.reduce((result, a) => {
            result[a.key] = (state, ...rest) => {
                a.handler(state, ...rest)
            };
            return result;
        }, {})
    }

    getActionsNames() {
        return this.actions.map(a => a.key);
    }
}

export const editorActions = new Actions();

editorActions.addActions(navigationEditorActions);
editorActions.addActions(nodeManipulationEditorActions);
editorActions.addActions(foldingEditorActions);

