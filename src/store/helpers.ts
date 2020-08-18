import $ from "jquery";

let key = 0;


export function uniqueKey() {
    return 'id_' + key++;
}

export function createNode(attrs: Record<string, string> = {}) {
    const node = document.createElement('div');

    for (const [key, value] of Object.entries(attrs)) {
        node.setAttribute(key, value);
    }

    if (!node.id) {
        node.id = uniqueKey();
    }

    return node;
}

export interface EditorDisplayNodeType {
    tagName: string;
    hasChildren: boolean;
    id?: string;
    children: EditorDisplayNodeType[],
    selected: boolean;
    textContent: string;
    attributes?: any[];
    folded?: boolean;
}
export function importNode(node: HTMLElement, currentNodeKey: string): EditorDisplayNodeType {
    const children = ([...node.childNodes] as HTMLElement[])
        .map(((n: HTMLElement) => importNode(n, currentNodeKey)));
    if (node.nodeType === 3) {
        return {
            tagName: '',
            hasChildren: false,
            children: [],
            selected: currentNodeKey === node.id,
            textContent: node.textContent  || '',
        }
    }

    const attributes = [];
    for (const a of node.attributes) {
        if (a.nodeName !== 'id' && !a.nodeName.startsWith('data-editor-meta')) {
            attributes.push({name: a.nodeName, value: a.nodeValue});
        }
    }

    return {
        tagName: node.tagName,
        id: node.getAttribute('data-editor-meta-id') || node.id,
        textContent: node.textContent || '',
        attributes,
        hasChildren: !!children.length,
        folded: node.getAttribute('data-editor-meta-folded') === 'true',
        selected: currentNodeKey === node.id,
        children: children,
    };
}

export function findRootNode(node: JQuery) {
    return node.closest('#root');
}

export function getFirstExisting(...arr: JQuery[]) {
    for (const a of arr) {
        if (a.length) {
            return a;
        }
    }
    return $();
}

export function cleanUpHtml(node: JQuery) {
    return $(node).find('*')
        .removeAttr('id')
        .attr('id', function () {
            return this.getAttribute('data-editor-meta-id') || '';
        })
        .removeAttr('data-editor-meta-id')
        .end()
        .find('text')
        .unwrap()
        .end()
        .html();
}

export function importHtml(html: string) {
    return $(html).find(':not([id])')
        .attr('id', uniqueKey)
        .end().get(0).outerHTML;
}
