import {createNode} from "@/store/helpers";
import {predicates} from "@/store/predicates";

export const nodeManipulationEditorActions = [
    {
        key: 'wrap',
        shortcut: 'w',
        displayPredicate: predicates.not(predicates.isRoot),
        handler(utils) {
            utils.commit(node => node.wrap(createNode()));
        }
    },
    {
        key: 'addChild',
        shortcut: 'd',
        displayPredicate: predicates.not(predicates.isText),
        handler(utils) {
            utils.addChild();
        }
    }, {
        displayPredicate: predicates.not(predicates.isText),
        key: 'addTextNode',
        shortcut: 't',
        async handler(utils) {
            const text = await utils.input.getText();
            utils.addTextChild(text);
        }
    },
    {
        displayPredicate: predicates.not(predicates.isText),
        key: 'addChildAndFocus',
        shortcut: 'D',
        handler(utils) {
            utils.addChild(true);
        }
    },

    {
        key: 'setAttribute',
        displayPredicate: predicates.not(predicates.isText),
        shortcut: 'a',
        async handler(utils) {
            const attributeName = await utils.input.getText('', utils.stats.getByKey('attributeName'));
            const attributeValue = await utils.input.getText('', utils.stats.getByKey('attributeValue', attributeName));
            utils.attributes.setAttribute(attributeName, attributeValue);
        }
    },
    {
        key: 'updateTagName',
        displayPredicate: predicates.not(predicates.isText),
        shortcut: 'u',
        async handler(utils) {
            const tagName = await utils.input.getText('', utils.stats.getTagNames());
            utils.stats.useTagName(tagName);
            utils.updateTagName(tagName);
        }
    },
    {
        key: 'setId',
        shortcut: 'i',
        displayPredicate: predicates.not(predicates.isText),
        async handler(utils) {
            const id = await utils.input.getText(utils.getText());
            utils.setId(id);
        }
    },
    {
        key: 'updateText',
        shortcut: 't',
        displayPredicate: predicates.not(predicates.isText),
        async handler(utils) {
            const text = await utils.input.getText(utils.getText());
            utils.setText(text);
        }
    },
    {
        key: 'deleteNode',
        shortcut: 'Backspace',
        displayPredicate: predicates.not(predicates.isRoot),
        handler(utils) {
            utils.commit(node => {
                if (utils.hasNextSibling()) {
                    utils.goNextSibling();
                } else {
                    utils.goPrevious();
                }

                const parent = node.parent();
                node.remove();

                return parent;
            });

        }
    },
];
