import {findRootNode, getFirstExisting, uniqueKey} from "@/store/helpers";
import $ from 'jquery';
import {EditorModes} from "@/store/utils/mode";
import {EditorInput} from "@/store/utils/input";
import {EditorStats} from "@/store/utils/stats";
import {EditorAttributes} from "@/store/utils/attributes";
import {EditorTypeScript} from "@/store/typescript/utils";


export class EditorUtils {
    constructor(state) {
        this.state = state;
        this.mode = new EditorModes(state);
        this.input = new EditorInput(state, this);
        this.stats = new EditorStats(state, this);
        this.attributes = new EditorAttributes(state, this);
        this.ts = new EditorTypeScript(state, this);
    }

    // TODO(kirjs): This parses it every time, not optimal.
    get node() {
        const selector = '#' + this.state.files[this.state.selectedFileName].selectedNodeKey;
        const node = $(this.state.files[this.state.selectedFileName].code).find(selector).addBack(selector);
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


    findPrevious() {
        return getFirstExisting(
            this.node.prev().filter(':parent').find('*').last(),
            this.node.prev(),
            this.node.parent()
        )
    }

    findNext() {
        return getFirstExisting(
            this.node.children(),
            this.node.next(),
            this.node.parents().filter((_, el) => el.nextSibling).next(),
        )
    }

    goNext() {
        this.selectFirst(
            this.findNext()
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
        // Broken
        this.commit(([node]) => {
            const renamed = document.createElement(tagName);
            const parent = node.parentNode;

            for (const a of node.attributes) {
                renamed.setAttribute(a.nodeName, a.nodeValue);
            }
            renamed.innerHTML = node.innerHTML;
            parent.replaceChild(renamed, node);
            return $(parent);
        });
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

    addChild(tagName = 'div', makeCurrent = false) {
        const el = document.createElement(tagName);
        el.setAttribute('id', uniqueKey());

        this.commit(node => node.append(el));

        if (makeCurrent) {
            this.select(el.id);
        }
    }

    addSibling(tagName = 'div', makeCurrent = false) {
        const el = document.createElement(tagName);
        el.setAttribute('id', uniqueKey());

        this.commit(node => {
            $(el).insertAfter(node);
        });

        if (makeCurrent) {
            this.select(el.id);
        }
    }

    addTextChild(text) {
        this.addChild('text', true);
        this.setText(text);
    }

    /**
     * We use jquery to manipulate the DOM.
     * We store the tree as text, and serialize/deserialize it for every operation.
     */

    commit(callback) {
        const node = this.node;
        const result = callback(node);
        this.state.files[this.state.selectedFileName].code = findRootNode(result || node)[0].outerHTML;
    }

    select(id) {
        this.state.files[this.state.selectedFileName].selectedNodeKey = id;
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

    setClass(className) {
        this.commit(node => {
            return node.attr('class', className);
        });
    }

    moveDown() {
        const next = this.node.next();
        if (next.length) {
            this.commit((node) => {
                const parent = node.parent();
                swapNodes(node, next);
                return parent;
            })
        }
    }

    moveUp() {
        const prev = this.node.prev();
        if (prev.length) {
            this.commit((node) => {
                const parent = node.parent();
                swapNodes(node, prev);
                return parent;
            })
        }
    }


    moveRight() {
        const prev = this.node.prev();
        if (prev.length) {
            this.commit((node) => {
                prev.append(node);
                prev.parent().find('> #' + node.attr('id')).remove();
            })
        }
    }


}

function swapNodes(a, b) {
    const bId = '#' + b.attr('id');
    const tmp = $('<tmp></tmp>');
    const tmp2 = $('<tmp2></tmp2>');
    a.replaceWith(tmp);
    const p1 = tmp.parent();
    p1.find(bId).replaceWith(tmp2);
    tmp2.replaceWith(a);
    tmp.replaceWith(b);
    return b;
}
