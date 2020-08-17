import * as ts from 'typescript';

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
            node.body.statements.push(result)
            this.selectNode(result);
        }
    }
}

