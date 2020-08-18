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
        shortcut: 'c',
        inputs: [
            {key: 'tagNames',}
        ],
        displayPredicate: predicates.isNode,
        async handler(utils) {
            const tagName = await utils.input.getText('', utils.stats.getTagNames());
            utils.addChild(tagName);
        }
    },
    {
        key: 'addDiv',
        shortcut: 'd',
        displayPredicate: predicates.not(predicates.isText),
        handler(utils) {
            utils.addChild();
        }
    },
    {
        key: 'addSibling',
        shortcut: 's',
        displayPredicate: predicates.isNode,
        async handler(utils) {
            const tagName = await utils.input.getText('', utils.stats.getTagNames());
            utils.addSibling(tagName, true);
        }
    },
    {
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
            utils.addChild('div', true);
        }
    },

    {
        key: 'setAttribute',
        displayPredicate: predicates.not(predicates.isText),
        shortcut: 'a',
        async handler(utils) {
            const attributeName = await utils.input.getText('', utils.stats.getByKey('attributeName'));
            utils.stats.update('attributeName', attributeName);
            const currentValue = utils.node.attr(attributeName) || '';
            const attributeValue = await utils.input.getText(currentValue, utils.stats.getByKey('attributeValue', attributeName));
            utils.stats.update('attributeValue', attributeValue);
            utils.attributes.setAttribute(attributeName, attributeValue);
        }
    },
    {
        key: 'updateTagName',
        displayPredicate: predicates.not(predicates.isText),
        shortcut: 'u',
        async handler(utils, {tagName}) {
            if (!tagName) {
                tagName = await utils.input.getText('', utils.stats.getTagNames());
            }
            utils.stats.useTagName(tagName);
            utils.updateTagName(tagName);
        }
    },
    {
        key: 'setId',
        shortcut: '#',
        displayPredicate: predicates.not(predicates.isText),
        async handler(utils) {
            const id = await utils.input.getText(utils.getId() || '');
            utils.setId(id);
        }
    },
    {
        key: 'setClass',
        shortcut: '.',
        displayPredicate: predicates.not(predicates.isText),
        async handler(utils) {
            const id = await utils.input.getText(utils.getClass());
            utils.setClass(id);
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
                //debugger;
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
    {
        key: 'moveDown',
        shortcut: ['^ArrowDown', '^j'],
        handler(utils) {
            utils.moveDown();
        }
    },
    {
        key: 'moveUp',
        shortcut: ['^ArrowUp', '^k'],
        handler(utils) {
            utils.moveUp();
        }
    },
    {
        key: 'moveRight',
        shortcut: ['^ArrowRight', '^l'],
        handler(utils) {
            utils.moveRight();
        }
    },
];
