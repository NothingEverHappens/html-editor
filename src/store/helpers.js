import $ from "jquery";

let key = 0;

export function uniqueKey() {
    return 'id_' + key++;
}

export function createNode(attrs = {}) {
    const node = document.createElement('div');

    for (const [key, value] in Object.entries(attrs)) {
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
    if(node.nodeType === 3){
        return {
            tagName: '',
            hasChildren: false,
            children: [],
            selected: currentNodeKey === node.id,
            textContent: node.textContent,
        }
    }
    return {
        tagName: node.tagName,
        id: node.getAttribute('data-editor-meta-id'),
        textContent: node.textContent,
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

export function cleanUpHtml(node){

    return $(node).find('*')
        .removeAttr('id')
        .attr('id', function(){
            return this.getAttribute('data-editor-meta-id');
        })
        .removeAttr('data-editor-meta-id')
        .end()
        .find('text')
        .unwrap()
        .end()
        .html();



}
