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
import {Store} from "vuex";
import {filesEditorActions} from "@/store/actions/files";
import {jasmineEditorActions} from "@/store/typescript/jasmine/jasmine_actions";
import {jumpEditorActions} from "@/store/typescript/jump/jump_actions";
import {manipulateEditorActions} from "@/store/typescript/manipulate/manipulate_actions";


function getDisplayShortcut(shortcut: string | string[]) {
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
    addAction(action: EditorAction) {
        this.actions.push(action);
    }

    constructor(private readonly actions: EditorAction[] = []) {
    }

    getAction(key: string) {
        return this.actions.find(a => a.key === key);
    }

    withActions(actions: EditorAction[]) {
        return new Actions([...this.actions, ...actions]);
    }

    addActions(actions: EditorAction[]) {
        actions.forEach(a => this.addAction(a))
    }

    async execute(action: EditorActionDefinition, state: EditorState, store: Store<EditorState>) {
        const utils = new EditorUtils(state, store);
        const a = this.getActions(state, '', store).find(a => a.key === action.type);

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

    getActions(state: EditorState, filter = '', store: Store<EditorState>) {
        const utils = new EditorUtils(state, store);
        return this.actions.flatMap(a => {
            if ('generator' in a && typeof a.generator === 'function') {
                return (a.generator(utils, filter));
            }
            return a as EditorActionDefinition;
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

                const matchesMode = a.mode === '*' || (a.mode || mode.NORMAL).type === state.mode.type;

                return matchesPredicate && matchesMode;
            })

    }
}

export const editorActions = new Actions()
    .withActions(navigationEditorActions)
    .withActions(nodeManipulationEditorActions)
    .withActions(foldingEditorActions)
    .withActions(metaEditorActions)
    .withActions(inputActions)
    .withActions(jsActions)
    .withActions(filesEditorActions)
    .withActions(jumpEditorActions)
    .withActions(jasmineEditorActions)
    .withActions(manipulateEditorActions);


/**

 TODO(kirjs): Type this smarted
 interface TypedThing {
    readonly type: string;
}


 class TypedThingsManager<T extends Readonly<TypedThing[]>, U = T[number]['type']> {
    constructor(readonly actions: T) {
    }

    assertActionByType(type: U) {
        return this;
    }

    addActions<S extends Readonly<TypedThing[]>, U2 = S[number]['type']>(actions: S): TypedThingsManager<Readonly<[...T, ...S]>, U|U2> {
        return new TypedThingsManager([...this.actions, ...actions] as const);
    }
}

 new TypedThingsManager([{type: '1'}, {type: '2'}] as const)
 .assertActionByType('4') // Error
 .addActions([{type: '4'}] as const)
 .assertActionByType('1')
 .assertActionByType('4')
 .assertActionByType('6') // Error
 */
