import {EditorState} from "@/store/types";
import {EditorUtils} from "@/store/utils/utils";
import ts from 'typescript';

export class EditorJasmine {

    constructor(private readonly state: EditorState,
                private readonly utils: EditorUtils) {

    }

    addDescribe() {
        this.utils.ts.transformVisit((node, context) => {
            let varName = ts.createUniqueName('safe')
            context.hoistVariableDeclaration(varName)
            if (ts.isSourceFile(node)) {

                // eslint-disable-next-line no-debugger
               return ts.updateSourceFileNode();
                return node;
            }
            return node;
        });
    }


}
