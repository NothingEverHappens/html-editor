import {navigationEditorActions} from "@/store/actions/navigation";
import {nodeManipulationEditorActions} from "@/store/actions/nodeManipulation";
import {foldingEditorActions} from "@/store/actions/folding";

export class Actions {
    actions = [];

    addAction(action) {
        this.actions.push(action);
    }

    addActions(actions) {
        actions.forEach(a => this.addAction(a))
    }

    getActions(){
        return this.actions;
    }

    getActionsHandlers(){
        return this.actions.reduce((result, a)=>{
            result[a.key] = a.handler;
            return result;
        }, {})
    }

    getActionsNames(){
        return this.actions.map(a=>a.key);
    }
}

export const editorActions = new Actions();

editorActions.addActions(navigationEditorActions);
editorActions.addActions(nodeManipulationEditorActions);
editorActions.addActions(foldingEditorActions);

