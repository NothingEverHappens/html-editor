import {EditorAction} from "@/store/types";
import {mode} from "@/store/utils/mode";
import {manipulatePredicates} from "@/store/typescript/manipulate/manipulate_predicates";
import ts from 'typescript';

export const manipulateEditorActions: EditorAction[] = [
    {
        key: 'add',
        shortcut: '+',
        type: '*',
        displayPredicate: manipulatePredicates.isPartOfAList,
        mode: mode.NORMAL,
        handler(utils) {
            const prop = utils.ts.getContainingArrayPropName() as string;
            const parent = utils.ts.node.parent;

            // eslint-disable-next-line no-debugger
            debugger;

            const newParent = ts.getMutableClone(parent) as any;
            const newNode = ts.getMutableClone(utils.ts.node);

            newParent[prop] = [...newParent[prop], newNode];

            utils.ts.replaceNode(parent, newParent)


        }
    },
];
