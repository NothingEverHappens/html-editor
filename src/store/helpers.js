let key = 0;

export function uniqueKey() {
    return 'id_' + key++;
}

export function createNode(node){
    return {
        parent: null,
        firstChild: null,
        lastChild: null,
        folded: false,
        attributes: [],
        ...node,
    }
}
