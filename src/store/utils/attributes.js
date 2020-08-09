export class EditorAttributes {
    constructor(state, utils) {
        this.state = state;
        this.utils = utils;
    }

    flipAttribute(name) {
        this.utils.commit(node => {
            node.attr(name, node.attr(name) === 'true' ? 'false' : true);
        });
    }

    setAttribute(name, value) {
        this.utils.commit(node => {
            node.attr(name, value);
        })
    }
}
