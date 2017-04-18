var arr = []

function tree(node) {
    if (node.level != 4) 
        node.children = a.filter(e => e.level == node.level + 1 && e.parent == node.code).map(e => tree(e))
    return node
}

ss(arr)
