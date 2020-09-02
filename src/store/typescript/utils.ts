import ts, {PropertyDeclaration} from 'typescript';
import {tsquery} from '@phenomnomnominal/tsquery';
import {EditorState, TsFile} from "@/store/types";
import {EditorUtils} from "@/store/utils/utils";
import {transformVisit, tsAstRename} from "@/store/typescript/transform";
import {EditorJasmine} from "@/store/typescript/jasmine/jasmine_utils";

export function parseTypeScriptFile(code: string, file: string) {
    return ts.createSourceFile(
        file,
        code,
        ts.ScriptTarget.ES2015,
        /*setParentNodes */ true
    );
}

// function logElement(node) {
//     console.log(kindMap[node.kind], node);
// }

function stripRanges<T extends ts.Node>(node: T) {
    node.pos = -1;
    node.end = -1;

    ts.forEachChild(node, stripRanges);
    return node;
}

export class EditorTypeScript {
    readonly jasmine = new EditorJasmine(this.state, this.utils);

    constructor(private readonly state: EditorState,
                private readonly utils: EditorUtils) {
    }

    stripRanges<T extends ts.Node>(node: T) {
        return stripRanges(node);
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

    set tree(tree) {
        this.file.tree = tree;
    }

    selectNode(node: ts.Node) {
        if (node) {
            this.file.selectedNode = node;
        }
    }

    setSelectableNodes(nodes: ts.Node[]) {
        this.file.selectableNodes = nodes;
    }

    generate() {
        const node = this.tree;
        const printer = ts.createPrinter({newLine: ts.NewLineKind.LineFeed});
        const resultFile = ts.createSourceFile("someFileName.ts", "", ts.ScriptTarget.Latest, /*setParentNodes*/ false, ts.ScriptKind.TS);
        return printer.printNode(ts.EmitHint.Unspecified, node, resultFile);

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

    transformVisit(callback: (node: ts.Node, context: ts.TransformationContext) => ts.Node) {
        this.tree = transformVisit(this.tree, callback);
        // eslint-disable-next-line no-debugger
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
        this.file.tree = tsAstRename(this.tree, (this.node as ts.Identifier).text, name);
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

    goToNext(selector: string) {
        // eslint-disable-next-line no-debugger
        debugger;
        const nodes = tsquery(this.utils.ts.tree, selector);

        if (nodes.length === 0) {
            return;
        }

        this.setSelectableNodes(nodes);


        for (let i = 0; i < nodes.length; i++) {
            const prevIndex = (nodes.length + i - 1) % nodes.length;
            console.log(prevIndex);
            if (nodes[prevIndex] === this.node) {

                this.selectNode(nodes[i]);
                return;
            }
        }


        this.selectNode(nodes[0]);
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

    findOutType() {
        this.state.languageService?.findOutType(this.node);
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

    transformNode<T extends ts.Node>(a: T, callback: (b: T) => T) {
        this.transformVisit((node) => node === a ? callback(a) : node);
    }

    replaceNode(a: ts.Node, b: ts.Node) {
        this.transformVisit((node) => node === a ? b : node);
    }
}

