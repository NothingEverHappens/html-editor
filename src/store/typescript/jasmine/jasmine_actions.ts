import {EditorAction} from "@/store/types";
import {mode} from "@/store/utils/mode";

export const jasmineEditorActions: EditorAction[] = [
    {
        key: 'jasmine',
        shortcut: 'g',
        type: '*',
        mode: mode.NORMAL,
        handler(utils) {
            utils.mode.setMode(mode.JASMINE);
        }
    },
    {
        key: 'addDescribe',
        shortcut: 'd',
        type: '*',
        mode: mode.JASMINE,
        handler(utils) {
            utils.ts.jasmine.addDescribe();
        }
    },
    {
        key: 'add it',
        shortcut: 'i',
        type: '*',
        mode: mode.JASMINE,
        handler(utils) {
            utils.ts.jasmine.addIt();
        }
    },
    {
        key: 'nextDescribe',
        shortcut: 't',
        type: '*',
        mode: mode.JASMINE,
        handler(utils) {
            utils.ts.goToNext('CallExpression > Identifier');
        }
    },  {
        key: 'nextIt',
        shortcut: 'y',
        type: '*',
        mode: mode.JASMINE,
        handler(utils) {
            utils.ts.goToNext('CallExpression > Identifier[name="it"]');
        }
    },
    {
        key: 'update description',
        shortcut: 'w',
        type: '*',
        mode: mode.JASMINE,
        async handler(utils) {
            utils.ts.jasmine.getDescribeText();
            const name = await utils.input.getText('', utils.ts.getIdentifiers());
            utils.ts.jasmine.renameDescribe(name);
        }
    },
    {
        key: 'exit jasmine',
        shortcut: 'Escape',
        type: '*',
        mode: mode.JASMINE,
        handler(utils) {
            utils.mode.setMode(mode.NORMAL);
        }
    },
];
