import {findRootNode} from "@/store/helpers";


export class EditorQueries {
    constructor(state, utils) {
        this.state = state;
        this.utils = utils;
    }

    flipAttribute(name) {
        const node = this.utils.node;
        node.attr(name, node.attr(name) === 'true' ? 'false' : true);
        this.state.node = findRootNode(node)[0].outerHTML;
    }
}
