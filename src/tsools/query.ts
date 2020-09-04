import ts from "typescript";

function extractAllChildren(node: ts.Node) {
    const nodes: ts.Node[] = [node];

    function visit(node: ts.Node) {
        ts.forEachChild(node, n => {
            nodes.push(n);
            visit(n);
        });
    }

    visit(node);

    return nodes;
}


function extractDirectChildren(node: ts.Node) {
    const nodes: ts.Node[] = [];

    function visit(node: ts.Node) {
        ts.forEachChild(node, n => {
            nodes.push(n);
        });
    }

    visit(node);

    return nodes;
}


function extractOnlyParents(node: ts.Node) {
    const nodes: ts.Node[] = [];

    while (node.parent) {
        node = node.parent;
        nodes.push(node);
    }

    return nodes;
}

function extractParentsAndNode(node: ts.Node) {
    return [node, ...extractOnlyParents(node)];
}

function compose(a: ((af: ts.Node[]) => ts.Node[]), b: ((bf: ts.Node[]) => ts.Node[])) {
    return (f: ts.Node[]) => b(a(f));
}

type TsqcCallback = (a: ts.Node[]) => ts.Node[];
type TsqcFilterCallback = (a: ts.Node) => boolean;
type TsqcMapCallback = (a: ts.Node) => ts.Node;
export type Tsq = ReturnType<typeof tsqc>;

function tsqc(func: TsqcCallback = ((a: ts.Node[]) => a)) {
    const execute = function (nodes: ts.Node[]) {
        return func(nodes);
    };

    execute.withProp = (prop: string, value: string) => {
        return execute.filter(node => (node as any)[prop] === value);
    };
    execute.ofKind = (...kinds: ts.SyntaxKind[]) => {
        return execute.filter(node => kinds.includes(node.kind));
    };

    execute.fromNode = (node: ts.Node) => {
        return execute(extractAllChildren(node))
    };

    execute.singleNode = (node: ts.Node) => {
        return execute([node])[0];
    };

    function pipe(callback: TsqcCallback) {
        return tsqc(compose(func, callback));
    }

    execute.after = (node: ts.Node) => {
        return pipe(nodes => {
            const index = nodes.indexOf(node);
            console.assert(index > -1);
            return nodes.slice(index + 1);
        });
    };
    execute.before = (node: ts.Node) => {
        return pipe(nodes => {
            const index = nodes.indexOf(node);
            console.assert(index > -1);
            return nodes.slice(0, index - 1);
        });
    };


    execute.filter = (c: TsqcFilterCallback) => {
        return pipe(nodes => nodes.filter(c));
    };

    execute.map = (c: TsqcMapCallback) => {
        return pipe(nodes => nodes.map(c));
    };

    execute.childArrayProp = (prop: string, index: number) => {
        return execute.map(node => (node as any)[prop][index]);
    };
    execute.child = (prop: string) => {
        return execute.map(node => (node as any)[prop]);
    };


    execute.closest = (c: TsqcCallback) => {
        return execute
            .map(node => {
                return c(extractParentsAndNode(node))[0];
            }).filter(a => !!a);
    };

    execute.hasParent = (query: ReturnType<typeof tsqc>) => {
        return execute.filter(node => node.parent && !!query.singleNode(node.parent));
    };

    execute.withChild = (query: ReturnType<typeof tsqc>) => {
        return execute.filter(node => query(extractDirectChildren(node)).length > 0);
    };


    execute.withChildProp = (childProp: string, query: ReturnType<typeof tsqc> = tsqc()) => {
        return execute.filter(node => {
            const child = (node as any)[childProp];
            return child && !!query.singleNode(child);
        });
    };

    execute.withChildArrayProp = (childProp: string, index: number, query: ReturnType<typeof tsqc> = tsqc()) => {
        return execute.filter(node => {
            const child = (node as any)[childProp][index];
            return child && !!query.singleNode(child);
        });
    };


    return execute;
}

export const tsq = tsqc();
