function foldChildren(key, nodes, selectedNodeKey) {
    const result = [];
    let node = nodes[key];

    while (node) {
        result.push(foldNode(node, nodes, selectedNodeKey));
        node = nodes[node.nextSibling];
    }

    return result;
}

export function foldNode(node, nodes, selectedNodeKey) {
    const children = foldChildren(node.firstChild, nodes, selectedNodeKey);
    return {
        hasChildren: children.length,
        children,
        selected: node.key === selectedNodeKey,
        ...node
    }
}


export function traverse(key, nodes, callback) {
    callback(key);
    if (nodes[key].firstChild) {
        traverseChildren(nodes[key].firstChild, nodes, callback);
    }
}

function traverseChildren(key, nodes, callback) {
    while (key) {
        traverse(key, nodes, callback);
        key = nodes[key].nextSibling;
    }
}

function mapChildren(key, nodes, callback) {
    const result = [];
    traverse(key, nodes, (k) => {
        result.push(callback(k));
    });
    return result;
}

export function getAllKeys(key, nodes) {
    return mapChildren(key, nodes, a => a)
}
