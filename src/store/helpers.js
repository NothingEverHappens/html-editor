import $ from "jquery";

let key = 0;


export function uniqueKey() {
    return 'id_' + key++;
}

export function createNode(attrs = {}) {
    const node = document.createElement('div');

    for (const [key, value] of Object.entries(attrs)) {
        node.setAttribute(key, value);
    }

    if (!node.id) {
        node.id = uniqueKey();
    }

    return node;
}

export function importNode(node, currentNodeKey) {
    let children = [...node.childNodes]
        .map(n => importNode(n, currentNodeKey));
    if (node.nodeType === 3) {
        return {
            tagName: '',
            hasChildren: false,
            children: [],
            selected: currentNodeKey === node.id,
            textContent: node.textContent,
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
        textContent: node.textContent,
        attributes,
        hasChildren: children.length,
        folded: node.getAttribute('data-editor-meta-folded') === 'true',
        selected: currentNodeKey === node.id,
        children: children,
    };
}

export function findRootNode(node) {
    return node.closest('#root');
}

export function getFirstExisting(...arr) {
    for (const a of arr) {
        if (a.length) {
            return a;
        }
    }
    return $();
}

export function cleanUpHtml(node) {
    return $(node).find('*')
        .removeAttr('id')
        .attr('id', function () {
            return this.getAttribute('data-editor-meta-id');
        })
        .removeAttr('data-editor-meta-id')
        .end()
        .find('text')
        .unwrap()
        .end()
        .html();
}

export function importHtml(html) {
    return $(html).find(':not([id])')
        .attr('id', uniqueKey)
        .end().get(0).outerHTML;
}
