export const foldingEditorActions = [
    {
        key: 'fold',
        shortcut: 'f',
        handler(utils) {
            utils.attrs.flipAttr('data-editor-meta-folded');
        }
    },

];
