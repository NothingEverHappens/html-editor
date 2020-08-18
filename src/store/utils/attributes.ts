import {EditorState} from "@/store/types";
import {EditorUtils} from "@/store/utils/utils";

export class EditorAttributes {
    constructor(private readonly state: EditorState,
                private readonly utils: EditorUtils) {

    }

    flipAttribute(name: string) {
        this.utils.commit(node => {
            node.attr(name, node.attr(name) === 'true' ? 'false' : 'true');
        });
    }

    setAttribute(name: string, value: string) {
        this.utils.commit(node => {
            node.attr(name, value);
        })
    }
}
