import {navigationEditorActions} from "@/store/actions/navigation";
import {nodeManipulationEditorActions} from "@/store/actions/nodeManipulation";
import {foldingEditorActions} from "@/store/actions/folding";
import {DomUtils} from "@/store/utils";

export class Actions {
    actions = [];

    addAction(action) {
        this.actions.push(action);
    }

    addActions(actions) {
        actions.forEach(a => this.addAction(a))
    }

    execute(action, state){
        const utils = new DomUtils(state);
        const a = this.actions.find(a => a.key === action.type);

        if(!a){
            throw new Error('action does not exist: ' + action.type);
        }

        a.handler.call(this, state, utils);
    }

    getActions() {
        return this.actions;
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

