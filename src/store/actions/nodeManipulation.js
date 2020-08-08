import {createNode, findCurrentNode, findRootNode} from "@/store/helpers";
import {modes} from "@/store/utils/modes";
import {predicates} from "@/store/predicates";

export const nodeManipulationEditorActions = [
    {
        key: 'wrap',
        shortcut: 'w',
        displayPredicate: predicates.isNotRoot,
        handler(state) {
            const node = findCurrentNode(state);
            node.wrap(createNode());
            state.node = findRootNode(node)[0].outerHTML;
        }
    },
    {
        key: 'addChild',
        shortcut: 'd',
        displayPredicate: predicates.not(predicates.isText),
        handler(state, utils) {
            utils.addChild(state);
        }
    }, {
        displayPredicate: predicates.not(predicates.isText),
        key: 'addTextNode',
        shortcut: 't',
        async handler(state, utils) {
            const text =  await utils.input.getText();
            utils.addTextChild(text);
        }
    },
    {
        displayPredicate: predicates.not(predicates.isText),
        key: 'addChildAndFocus',
        shortcut: 'D',
        handler(state, utils) {
            utils.addChild(state, true);
        }
    },

    {
        key: 'setAttribute',
        displayPredicate: predicates.not(predicates.isText),
        shortcut: 'a',
        handler() {
        }
    },
    {
        key: 'updateTagName',
        displayPredicate: predicates.not(predicates.isText),
        shortcut: 'u',
        handler(state, utils) {
            utils.modes.setMode(modes.SELECT_TAG_NAME)
        }
    },
    {
        key: 'updateContent',
        shortcut: 'c',
        displayPredicate: predicates.isText,
        async handler(state, utils) {

            const text =  await utils.input.getText(utils.getText());
            utils.setText(text);
        }
    },
    {
        generator(state) {
            function handler(state, utils) {
                console.assert(typeof state.modeArg === 'function');
                state.modeArg(state.filter);
                utils.modes.setMode(modes.NORMAL);
            }

            return {
                key: state.filter,
                shortcut: 'Enter',
                mode: modes.UPDATE_CONTENT,
                handler
            };

        }
    },
    {
        generator(state) {
            const tags = ['SPAN', 'DIV', 'HEADER', 'INPUT'];

            function handler(state, utils) {
                utils.updateTagName(this.key);
                state.mode = modes.NORMAL;
                state.inputFocused = false;
                state.filter = '';
            }

            const result = tags.map((key, shortcut) => {
                    return {
                        key,
                        shortcut: '^' + shortcut.toString(),
                        mode: modes.SELECT_TAG_NAME,
                        handler
                    };
                }
            );

            if (state.filter) {
                result.push({
                    key: state.filter,
                    shortcut: 'Enter',
                    mode: modes.SELECT_TAG_NAME,
                    handler
                });
            }

            return result;
        }
    },

    {
        key: 'deleteNode',
        shortcut: 'Backspace',
        handler(state, utils) {
            const node = findCurrentNode(state);

            if (node.attr('id') === 'root') {
                return;
            }

            if (utils.hasNextSibling()) {
                utils.goNextSibling();
            } else {
                utils.goPrevious();
            }

            const parent = node.parent();
            node.remove();

            state.node = findRootNode(parent)[0].outerHTML;
        }
    },
];
