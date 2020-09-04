import {EditorAction} from "@/store/types";
import {mode} from "@/store/utils/mode";
import {fileTypes} from "@/store/store";
import {queries} from "@/store/typescript/jump/queries";
import {jumpPredicates} from "@/store/typescript/jump/jump_predicates";

export const jumpEditorActions: EditorAction[] = [
    {
        key: 'jump',
        shortcut: 'j',
        type: '*',
        mode: mode.NORMAL,
        handler(utils) {
            utils.mode.setMode(mode.JUMP);
        }
    },
    {
        key: 'goToIdentifier',
        type: fileTypes.TYPESCRIPT,
        shortcut: 'i',
        async handler(utils, action, name: any) {
            if (!name) {
                name = await utils.input.getText('', utils.ts.getIdentifiers());
            }
            utils.ts.jumpToIdentifier(name);
        }
    },
    {
        key: 'jumpToClass',
        type: fileTypes.TYPESCRIPT,
        mode: mode.JUMP,
        displayPredicate: jumpPredicates.documentContainsNode(queries.classDeclaration),
        shortcut: 'c',
        async handler(utils) {
            utils.ts.jumpForwardQuery(queries.classDeclaration);
        }
    },
    {
        key: 'jumpToMethod',
        type: fileTypes.TYPESCRIPT,
        mode: mode.JUMP,
        shortcut: 'm',
        async handler(utils) {
            utils.ts.jumpToSelector('MethodDeclaration');
        }
    },
    {
        key: 'jumpToJsx',
        type: fileTypes.TYPESCRIPT,
        mode: mode.JUMP,
        displayPredicate: jumpPredicates.documentContainsNode(queries.jsx),
        shortcut: 't',
        async handler(utils) {
            utils.ts.jumpToSelector('JsxOpeningElement,JsxSelfClosingElement');
        }
    },
    {
        key: 'jumpToParameter',
        type: fileTypes.TYPESCRIPT,
        mode: mode.JUMP,
        displayPredicate: jumpPredicates.documentContainsNode(queries.parameter),
        shortcut: 'a',
        async handler(utils) {
            utils.ts.jumpForwardQuery(queries.parameter);
        }
    }, {
        key: 'jumpBackToParameter',
        type: fileTypes.TYPESCRIPT,
        mode: mode.JUMP,
        displayPredicate: jumpPredicates.documentContainsNode(queries.parameter),
        shortcut: '⇧A',
        async handler(utils) {
            utils.ts.jumpBackQuery(queries.parameter);
        }
    },
    {
        key: 'jumpToProperty',
        type: fileTypes.TYPESCRIPT,
        displayPredicate: jumpPredicates.documentContainsNode(queries.PropertyDeclaration),
        mode: mode.JUMP,
        shortcut: 'p',
        async handler(utils) {
            utils.ts.jumpForwardQuery(queries.PropertyDeclaration);
        }
    },
    {
        key: 'jumpToBlock',
        type: fileTypes.TYPESCRIPT,
        mode: mode.JUMP,
        shortcut: 'b',
        async handler(utils) {
            utils.ts.jumpToSelector('Block');
        }
    },

];
