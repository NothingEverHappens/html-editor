import {fileTypes, Panel} from "@/store/store";
import {tsPredicates} from "@/store/typescript/predicates";
import {EditorAction} from "@/store/types";
import ts, {Identifier} from 'typescript';


export const jsActions: EditorAction[] = [
    {
        key: 'save',
        type: fileTypes.TYPESCRIPT,
        shortcut: 's',
        handler(utils, a) {
            utils.saveFile();
        }
    },
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
        displayPredicate: tsPredicates.nodeKind(ts.SyntaxKind.PropertyDeclaration),
        async handler(utils) {
            utils.ts.flipReadonly();
        }
    },
    {
        key: 'flip boolean',
        type: fileTypes.TYPESCRIPT,
        shortcut: '~',
        displayPredicate: tsPredicates.nodeKind(ts.SyntaxKind.TrueKeyword, ts.SyntaxKind.FalseKeyword),
        async handler(utils) {
            utils.ts.flipReadonly();
        }
    },
    {
        key: 'return',
        type: fileTypes.TYPESCRIPT,
        shortcut: 'r',
        displayPredicate: tsPredicates.nodeKind(ts.SyntaxKind.FunctionDeclaration),
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
        key: 'findOutType',
        type: fileTypes.TYPESCRIPT,
        shortcut: 'u',
        handler(utils) {
            utils.ts.findOutType();
        }
    },
    {
        key: 'quickJump',
        type: fileTypes.TYPESCRIPT,
        generator(utils) {
            return (utils.ts.file.selectableNodes || []).map((node, i) => {
                return {
                    key: 'quickAction ' + i,
                    shortcut: i.toString(),
                    mode: '*',
                    type: '*',
                    panel: Panel.CODE,
                    handler() {
                        utils.ts.selectNode(node);
                        utils.ts.setSelectableNodes([]);
                    }
                };

            });
        }
    }
];
