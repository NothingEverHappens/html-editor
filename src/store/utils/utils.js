import {findCurrentNode, findRootNode, getFirstExisting, uniqueKey} from "@/store/helpers";
import $ from 'jquery';
import {EditorModes} from "@/store/utils/modes";
import {EditorInput} from "@/store/utils/input";


export class EditorUtils {
    constructor(state) {
        this.state = state;
        this.modes = new EditorModes(state);
        this.input = new EditorInput(state, this);
    }

    get node() {
        return findCurrentNode(this.state);
    }

    hasNextSibling() {
        return this.node.next().length > 0;
    }

    goChild() {
        const node = this.node;

        const parentId = node.children().attr('id');
        if (parentId) {
            this.state.selectedNodeKey = parentId;
        }
    }

    goNext() {
        const node = this.node;

        const nextId = getFirstExisting(
            node.children(),
            node.next(),
            node.parents().filter((_, el) => el.nextSibling).next(),
        ).attr('id');

        if (nextId) {
            this.state.selectedNodeKey = nextId;
        }
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

    goNextSibling() {
        const node = this.node;

        const nextId = getFirstExisting(
            node.next(),
        ).attr('id');

        if (nextId) {
            this.state.selectedNodeKey = nextId;
        }
    }

    goPrevious() {
        const node = this.node;

        const prevId = getFirstExisting(
            node.prev().filter(':parent').find('*').last(),
            node.prev(),
            node.parent()
        ).attr('id');

        if (prevId) {
            this.state.selectedNodeKey = prevId;
        }
    }

    isRoot() {
        return this.node.attr('id') === 'root'
    }

    isText() {
        return this.node[0].nodeName === 'TEXT';
    }

    setText(content) {
        const node = this.node;
        node.text(content);
        this.state.node = findRootNode(node)[0].outerHTML;
    }

    getText() {
        return this.node.text();
    }

    addChild(state, makeCurrent = false) {
        const el = document.createElement('div');
        el.setAttribute('id', uniqueKey());
        let root = findCurrentNode(state).append(el);
        state.node = findRootNode(root)[0].outerHTML;

        if (makeCurrent) {
            state.selectedNodeKey = el.id;
        }
    }

    addTextChild(text) {
        this.addChild(this.state, true);
        this.updateTagName('text');
        const node = this.node;
        node.text(text);
        this.state.node = findRootNode(node)[0].outerHTML;
    }


}
