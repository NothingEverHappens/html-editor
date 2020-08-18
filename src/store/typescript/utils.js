import * as ts from 'typescript';
import {tsquery} from '@phenomnomnominal/tsquery';

export function parseTypeScriptFile(code) {
    const r = ts.createSourceFile(
        'any.ts',
        code,
        ts.ScriptTarget.ES2015,
        /*setParentNodes */ true
    );

    return r;
}

// function logElement(node) {
//     console.log(kindMap[node.kind], node);
// }

export class EditorTypeScript {
    constructor(state, utils) {
        this.state = state;
        this.utils = utils;
    }

    get node() {
        return this.state.files[this.state.selectedFileName].selectedNode;
    }

    get tree() {
        return this.state.files[this.state.selectedFileName].tree;
    }

    selectNode(node) {
        if (node) {
            this.state.files[this.state.selectedFileName].selectedNode = node;
        }
    }

    goChild() {
        const node = this.node;
        let hasEl;
        ts.forEachChild(node, (n) => {
            if (!hasEl) {
                hasEl = true;
                this.selectNode(n);
            }

        });
    }

    goNext() {
        const node = this.node;
        let passedCurrent = false;
        let hasEl = false;


        ts.forEachChild(node.parent, (n) => {
            if (hasEl && passedCurrent) {
                return;
            }

            if (n === node) {
                passedCurrent = true;
                return;
            }
            if (passedCurrent && !hasEl) {
                hasEl = true;
                this.selectNode(n);
            }
        });
    }

    rename(name) {
        this.node.escapedText = name;
    }

    flipReadonly() {
        if (!this.node.modifiers) {
            this.node.modifiers = [];
        }
        if (this.node.modifiers.some(a => a.kind === 138)) {
            this.node.modifiers = this.node.modifiers.filter(a => a.kind !== 138);
        } else {
            this.node.modifiers.push(ts.createToken(ts.SyntaxKind.ReadonlyKeyword));
        }
    }

    goPrev() {
        const node = this.node;
        let prev;
        let hasEl = false;


        ts.forEachChild(node.parent, (n) => {
            if (hasEl) {
                return;
            }

            if (n === node) {
                this.selectNode(prev);
                hasEl = true;
            }

            prev = n;
        });
    }

    goParent() {
        this.selectNode(this.node.parent);
    }

    jumpToReturn() {
        const node = this.utils.ts.node;
        const child = node.body.statements.find(s => s.kind === 235);
        if (child) {
            this.selectNode(child);
        } else {
            const result = ts.createReturn();
            node.body.statements.push(result);
            this.selectNode(result);
        }
    }

    jumpToSelector(selector) {
        const nodes = tsquery(this.utils.ts.tree, selector);
        const next = (nodes.indexOf(this.node) + 1) % (nodes.length);
        console.log(next, (nodes.indexOf(this.node) + 1), (nodes.indexOf(this.node) + 1) % (nodes.length - 1));
        this.selectNode(nodes[next]);
    }

    jumpToIdentifier(name) {
        const node = this.utils.ts.tree;
        const nodes = tsquery(node, 'Identifier[name="' + name + '"]');
        if (nodes.length) {
            this.selectNode(nodes[0]);
        }
    }

    getIdentifiers() {
        return [...this.tree.identifiers.values()].map(key => ({key, used: 0}));
    }
}

