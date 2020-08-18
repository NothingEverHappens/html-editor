export const foldingEditorActions = [
    {
        key: 'fold',
        shortcut: 'f',
        handler(utils) {
            utils.attributes.flipAttribute('data-editor-meta-folded');
        }
    },

];
