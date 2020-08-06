import {findCurrentNode, findRootNode, getFirstExisting} from "@/store/helpers";
import $ from 'jquery';

export class DomUtils {
    constructor(state) {
        this.state = state;
    }

    get node() {
        return findCurrentNode(this.state);
    }

    hasNextSibling() {
        return this.node.next().length > 0;
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

    updateTagName() {
        const tagName = 'lol';
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
}
