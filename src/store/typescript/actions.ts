import {fileTypes} from "@/store/store";
import {tsPredicates} from "@/store/typescript/predicates";
import {EditorAction} from "@/store/types";
import {Identifier} from 'typescript';


export const jsActions: EditorAction[] = [
    {
        key: 'createFunction',
        type: fileTypes.TYPESCRIPT,
        shortcut: 'f',
        handler() {
            console.log(1);
        }
    },
    {
        key: 'goChild',
        type: fileTypes.TYPESCRIPT,
        shortcut: 'ArrowRight',
        handler(utils) {
            utils.ts.goChild();
        }
    },
    {
        key: 'goNext',
        type: fileTypes.TYPESCRIPT,
        shortcut: 'ArrowDown',
        handler(utils) {
            utils.ts.goNext();
        }
    },
    {
        key: 'rename',
        type: fileTypes.TYPESCRIPT,
        shortcut: 'r',
        displayPredicate: tsPredicates.nodeKind(['Identifier']),
        async handler(utils, action, name) {
            if (!name) {
                name = await utils.input.getText((utils.ts.node as Identifier).text, utils.stats.getTagNames());
            }
            utils.ts.rename(name);
        }
    },
    {
        key: 'flipReadonly',
        type: fileTypes.TYPESCRIPT,
        shortcut: 'r',
        displayPredicate: tsPredicates.nodeKind(['PropertyDeclaration']),
        async handler(utils) {
            utils.ts.flipReadonly();
        }
    },
    {
        key: 'flip boolean',
        type: fileTypes.TYPESCRIPT,
        shortcut: '~',
        displayPredicate: tsPredicates.nodeKind(['TrueKeyword', 'FalseKeyword']),
        async handler(utils) {
            utils.ts.flipReadonly();
        }
    },
    {
        key: 'jumpToClass',
        type: fileTypes.TYPESCRIPT,
        shortcut: 'c',
        async handler(utils) {
            utils.ts.jumpToSelector('ClassDeclaration');
        }
    },
    {
        key: 'jumpToMethod',
        type: fileTypes.TYPESCRIPT,
        shortcut: 'm',
        async handler(utils) {
            utils.ts.jumpToSelector('MethodDeclaration');
        }
    }, {
        key: 'jumpToJsx',
        type: fileTypes.TYPESCRIPT,
        shortcut: 't',
        async handler(utils) {
            utils.ts.jumpToSelector('JsxOpeningElement,JsxSelfClosingElement');
        }
    },
    {
        key: 'jumpToProperty',
        type: fileTypes.TYPESCRIPT,
        shortcut: 'p',
        async handler(utils) {
            utils.ts.jumpToSelector('PropertyDeclaration');
        }
    },
    {
        key: 'jumpToBlock',
        type: fileTypes.TYPESCRIPT,
        shortcut: 'b',
        async handler(utils) {
            utils.ts.jumpToSelector('Block');
        }
    },
    {
        key: 'return',
        type: fileTypes.TYPESCRIPT,
        shortcut: 'r',
        displayPredicate: tsPredicates.nodeKind(['FunctionDeclaration']),
        async handler(utils) {
            utils.ts.jumpToReturn();
        }
    },
    {
        key: 'goPrev',
        type: fileTypes.TYPESCRIPT,
        shortcut: 'ArrowUp',
        handler(utils) {
            utils.ts.goPrev();
        }
    },
    {
        key: 'goParent',
        type: fileTypes.TYPESCRIPT,
        shortcut: 'ArrowLeft',
        handler(utils) {
            utils.ts.goParent();
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
    }
];
