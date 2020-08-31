import {findRootNode, getFirstExisting, uniqueKey} from "@/store/helpers";
import $ from 'jquery';
import {EditorModes} from "@/store/utils/mode";
import {EditorInput} from "@/store/utils/input";
import {EditorStats} from "@/store/utils/stats";
import {EditorAttributes} from "@/store/utils/attributes";
import {EditorTypeScript} from "@/store/typescript/utils";
import {EditorState, HtmlFile} from "@/store/types";
import {Store} from "vuex";


export class EditorUtils {
    readonly mode = new EditorModes(this.state);
    readonly input = new EditorInput(this.state, this);
    readonly stats = new EditorStats(this.state, this);
    readonly attributes = new EditorAttributes(this.state, this);
    readonly ts = new EditorTypeScript(this.state, this);

    constructor(readonly state: EditorState, private readonly store: Store<any>) {

    }

    // TODO(kirjs): This parses it every time, not optimal.
    get node() {
        const file = this.file;
        const selector = '#' + file.selectedNodeKey;
        return $(file.code).find(selector).addBack(selector);

    }

    get file(): HtmlFile {
        const file = this.state.files[this.state.selectedFileName];
        console.log('do i work? Can you mutate me?');
        console.assert(file.type === 'html');
        if (file.type === 'html') {
            return file;
        }
        throw ('fix me');
    }

    async saveFile() {
        const code = this.ts.generate();
        const file = this.ts.file.path;

        await fetch(
            '/files',
            {
                method: 'post',
                body: JSON.stringify({code, file}),
                headers: {
                    'Content-Type': 'application/json'
                },
            }
        );
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


    findNext() {
        return getFirstExisting(
            this.node.children(),
            this.node.next(),
            this.node.parents().filter((_, el) => !!el.nextSibling).next(),
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

    updateTagName(tagName: string) {
        // Broken
        this.commit(([node]) => {
            const renamed = document.createElement(tagName);
            const parent = node.parentNode;
            if (!parent) {
                throw 'there is no parent, this should not happen';
            }

            for (const a of node.attributes) {
                renamed.setAttribute(a.nodeName, a.nodeValue || '');
            }
            renamed.innerHTML = node.innerHTML;
            parent.replaceChild(renamed, node);
            return $(parent) as JQuery<HTMLElement>;
        });
    }


    isRoot() {
        return this.node.attr('id') === 'root'
    }

    isText() {
        return this.node[0].nodeName === 'TEXT';
    }

    setText(text: string) {
        this.commit(node => node.text(text))
    }

    getText() {
        return this.node.text();
    }

    addChild(tagName = 'div', makeCurrent = false) {
        const el = document.createElement(tagName);
        el.setAttribute('id', uniqueKey());
        el.setAttribute('data-editor-meta-id', uniqueKey());

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

    addTextChild(text: string) {
        this.addChild('text', true);
        this.setText(text);
    }

    /**
     * We use jquery to manipulate the DOM.
     * We store the tree as text, and serialize/deserialize it for every operation.
     */

    commit(callback: (node: JQuery) => JQuery | void) {
        const node = this.node;
        const result = callback(node);
        this.file.code = findRootNode(result || node)[0].outerHTML;
    }

    select(id: string) {
        this.file.selectedNodeKey = id;
    }

    selectFirst(...queries: JQuery[]) {
        const firstExisting = getFirstExisting(...queries);
        const id = firstExisting.attr('id');
        if (id) {
            this.select(id);
        }
    }

    setId(id: string) {
        this.commit(node => {
            return node.attr('data-editor-meta-id', id);
        });
    }

    getId() {
        return this.node.attr('data-editor-meta-id');
    }

    setClass(className: string) {
        this.setAttr('class', className)
    }

    getClass() {
        return this.getAttr('class');
    }


    setAttr(name: string, value: string) {
        this.commit(node => {
            return node.attr(name, value);
        });
    }


    getAttr(name: string) {
        return this.node.attr(name);
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

function swapNodes(a: JQuery, b: JQuery) {
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
