import $ from "jquery";

let key = 0;

export function uniqueKey() {
    return 'id_' + key++;
}

export function createNode(attrs={}) {
    const node = document.createElement('div');

    for (const [key, value] in Object.entries(attrs)) {
        node.setAttribute(key, value);
    }
    if(!node.id){
        node.id = uniqueKey();
    }

    return node;
}

export function importNode(node, currentNodeKey){
    let children = [...node.childNodes].map(n =>importNode(n, currentNodeKey));
    return {
        tagName: node.tagName,
        id: node.id,
        hasChildren: children.length,
        folded: node.getAttribute('meta-folded') === 'true',
        selected: currentNodeKey === node.id,
        children: children,
    };
}

export function findCurrentNode(state){
    return $(state.node).wrap('div').parent().find('#' + state.selectedNodeKey);
}
export function findRootNode(node){
    return node.closest('#root');
}

export function getFirstExisting(...arr){
    for(const a of arr){
        if(a.length){
            return a;
        }
    }
    return $();

}
