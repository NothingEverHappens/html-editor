import {findRootNode, getFirstExisting, uniqueKey} from "@/store/helpers";
import $ from 'jquery';
import {EditorModes} from "@/store/utils/modes";
import {EditorInput} from "@/store/utils/input";
import {EditorStats} from "@/store/utils/stats";


export class EditorUtils {
    constructor(state) {
        this.state = state;
        this.modes = new EditorModes(state);
        this.input = new EditorInput(state, this);
        this.stats = new EditorStats(state, this);
    }

    // TODO(kirjs): This parses it every time, not optimal.
    get node() {
        const selector = '#' + this.state.selectedNodeKey;
        const node = $(this.state.node).find(selector).addBack(selector);
        return Object.freeze(node);
    }

    hasNextSibling() {
        return this.node.next().length > 0;
    }

    goChild() {
        this.selectFirst(this.node.children());
    }

    goParent() {
        this.selectFirst(this.node.parent());
    }

    goNext() {
        this.selectFirst(
            this.node.children(),
            this.node.next(),
            this.node.parents().filter((_, el) => el.nextSibling).next(),
        );
    }

    goNextSibling() {
        this.selectFirst(
            this.node.children()
        );
    }

    goPrevious() {
        this.selectFirst(
            this.node.prev().filter(':parent').find('*').last(),
            this.node.prev(),
            this.node.parent()
        );
    }

    updateTagName(tagName) {
        const node = this.node[0];
        const renamed = document.createElement(tagName);
        const parent = node.parentNode;

        for (const a of node.attributes) {
            renamed.setAttribute(a.nodeName, a.nodeValue);
        }
        renamed.innerHTML = node.innerHTML;
        parent.replaceChild(renamed, node);

        this.state.node = findRootNode($(parent))[0].outerHTML;
    }


    isRoot() {
        return this.node.attr('id') === 'root'
    }

    isText() {
        return this.node[0].nodeName === 'TEXT';
    }

    setText(content) {
        this.commit(node => node.text(content))
    }

    getText() {
        return this.node.text();
    }

    addChild(state, makeCurrent = false) {
        const el = document.createElement('div');
        el.setAttribute('id', uniqueKey());

        this.commit(node => node.append(el));

        if (makeCurrent) {
            this.select(el.id);
        }
    }

    addTextChild(text) {
        this.addChild(this.state, true);
        this.updateTagName('text');
        this.setText(text);
    }

    /**
     * We use jquery to manipulate the DOM.
     * We store the tree as text, and serialize/deserialize it for every operation.
     */

    commit(callback) {
        const node = this.node;
        this.state.node = findRootNode(callback(node) || node)[0].outerHTML;
    }

    select(id) {
        this.state.selectedNodeKey = id;
    }

    selectFirst(...queries) {
        const id = getFirstExisting(...queries).attr('id');
        if (id) {
            this.select(id);
        }
    }

    setId(id) {
        this.commit(node => {
            return node.attr('data-editor-meta-id', id);
        });
    }
}
