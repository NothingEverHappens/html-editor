import * as ts from 'typescript';
import {PropertyDeclaration} from 'typescript';
import {tsquery} from '@phenomnomnominal/tsquery';
import {EditorState, TsFile} from "@/store/types";
import {EditorUtils} from "@/store/utils/utils";

export function parseTypeScriptFile(code: string, file: string) {
    const r = ts.createSourceFile(
        file,
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
    constructor(private readonly state: EditorState,
                private readonly utils: EditorUtils) {

    }


    get file(): TsFile {
        const file = this.state.files[this.state.selectedFileName];
        console.assert(file.type === 'ts');
        return file as TsFile;
    }

    get node() {
        return this.file.selectedNode || this.file.tree;
    }

    get tree() {
        return this.file.tree;
    }

    selectNode(node: ts.Node) {
        if (node) {
            this.file.selectedNode = node;
        }
    }

    goChild() {
        const node = this.node;
        let hasEl: boolean;
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

    rename(name: string) {
        (this.node as unknown as ts.Identifier).escapedText = name as any;
    }

    flipReadonly() {
        const node = this.node as unknown as PropertyDeclaration as any;
        if (!node.modifiers) {
            node.modifiers = [];
        }
        if (node.modifiers.some((a: ts.Node) => a.kind === ts.SyntaxKind.ReadonlyKeyword)) {
            node.modifiers = node.modifiers.filter((a: ts.Node) => a.kind !== 138);
        } else {
            node.modifiers.push(ts.createToken(ts.SyntaxKind.ReadonlyKeyword));
        }
    }

    goPrev() {
        const node = this.node;
        let prev: ts.Node;
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
        const node = this.utils.ts.node as ts.FunctionDeclaration;
        const child = node.body!.statements.find(s => s.kind === 235);
        if (child) {
            this.selectNode(child);
        } else {
            const result = ts.createReturn();
            (node.body!.statements as any).push(result);
            this.selectNode(result);
        }
    }

    jumpToSelector(selector: string) {
        const nodes = tsquery(this.utils.ts.tree, selector);
        const next = (nodes.indexOf(this.node) + 1) % (nodes.length);
        console.log(next, (nodes.indexOf(this.node) + 1), (nodes.indexOf(this.node) + 1) % (nodes.length - 1));
        this.selectNode(nodes[next]);
    }

    jumpToIdentifier(name: string) {
        const node = this.utils.ts.tree;
        const nodes = tsquery(node, 'Identifier[name="' + name + '"]');
        if (nodes.length) {
            this.selectNode(nodes[0]);
        }
    }

    getIdentifiers() {
        return [...(this.tree as any).identifiers.values()].map(key => ({key, used: 0}));
    }
}

