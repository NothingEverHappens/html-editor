import {fileTypes} from "@/store/store";
import {tsPredicates} from "@/store/typescript/predicates";


export const jsActions = [
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
                name = await utils.input.getText(utils.ts.node.text, utils.stats.getTagNames());
            }
            utils.ts.rename(name);
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
        async handler(utils, action, name) {
            if (!name) {
                name = await utils.input.getText(utils.ts.node.text, utils.ts.getIdentifiers());
            }
            utils.ts.rename(name);
        }
    }
];
