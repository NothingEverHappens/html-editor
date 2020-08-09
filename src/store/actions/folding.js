export const foldingEditorActions = [
    {
        key: 'fold',
        shortcut: 'f',
        handler(state, utils) {
            utils.attrs.flipAttr('data-editor-meta-folded');
        }
    },

];
