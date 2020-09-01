import ts from 'typescript';
import {TsFile} from "@/store/types";

export class LanguageService {
    private readonly fileVersions = this.files.reduce((result: ts.MapLike<{ version: number }>, file: TsFile) => {
        result[file.path] = {version: 0};
        return result;
    }, {});

    private readonly fileNames = this.files.map(f => f.path);

    private readonly options: ts.CompilerOptions = {};
    private readonly service = this.initService();

    constructor(private readonly files: TsFile[]) {
        this.initService();

    }

    findOutType(node: ts.Node) {
        const info = this.service.getProgram()!.getTypeChecker().getTypeAtLocation(node);
        // eslint-disable-next-line no-debugger
        debugger

    }

    initService() {
        const servicesHost: ts.LanguageServiceHost = {
            getScriptFileNames: () => this.fileNames,
            getScriptVersion: fileName => this.fileVersions[fileName] && this.fileVersions[fileName].version.toString(),
            getScriptSnapshot: fileName => {
                const file = this.files.find(f => f.path === fileName);
                if (!file) {
                    return undefined;
                }
                const code = file.code;
                return ts.ScriptSnapshot.fromString(code);
            },
            getCurrentDirectory: () => {
                return '.';
            },
            getCompilationSettings: () => this.options,
            getDefaultLibFileName: options => ts.getDefaultLibFilePath(options),
            fileExists: (fileName) => {
                return this.files.some(f => f.path === fileName);
            },
            readFile: () => {
                // eslint-disable-next-line no-debugger
                debugger;
                return '';
            },
            readDirectory: () => {
                // eslint-disable-next-line no-debugger
                debugger;
                return []
            },

        };

        return ts.createLanguageService(servicesHost, ts.createDocumentRegistry());
    }
}

export function initLanguageService(files: TsFile[]) {
    return new LanguageService(files);
}
