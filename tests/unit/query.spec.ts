import ts from "typescript"
import {parseTypeScriptFile} from "@/store/typescript/utils";
import {tsq} from "@/tsools/query";


describe('query builder', () => {
    it('queries by kind', () => {
        const ast = parseTypeScriptFile(`describe('')`, 'lol.ts');
        const identifiers = tsq.ofKind(ts.SyntaxKind.Identifier).fromNode(ast);
        expect(identifiers.length).toBe(1);
        expect((identifiers[0] as ts.Identifier).text).toBe('describe');
    });

    it('allows to pass q as an argument', () => {
        const ast = parseTypeScriptFile(`describe('')`, 'lol.ts');
        const query = tsq.ofKind(ts.SyntaxKind.Identifier).fromNode;
        const identifiers = query(ast);
        expect(identifiers.length).toBe(1);
        expect((identifiers[0] as ts.Identifier).text).toBe('describe');
    });

    it('allows to identify describe block', () => {
        const ast = parseTypeScriptFile(`describe('lol', ()=>{
            console.log('hi');
        }`, 'lol.ts');
        const result = tsq.ofKind(ts.SyntaxKind.Identifier)
            .hasParent(tsq.ofKind(ts.SyntaxKind.CallExpression))
            .fromNode(ast);
        expect(result.length).toBe(1);
    });

    it('allows to identify describe block using withChild', () => {
        const ast = parseTypeScriptFile(`describe('lol', ()=>{
            console.log('hi');
        }`, 'lol.ts');
        const result = tsq.ofKind(ts.SyntaxKind.CallExpression)
            .withChild(tsq
                .ofKind(ts.SyntaxKind.Identifier)
            )
            .fromNode(ast);
        expect(result.length).toBe(1);
    });

    it('allows to identify describe block using hasProp', () => {
        const ast = parseTypeScriptFile(`describe('lol', ()=>{
            console.log('hi');
        }`, 'lol.ts');
        const result = tsq.ofKind(ts.SyntaxKind.CallExpression)
            .withChild(tsq
                .ofKind(ts.SyntaxKind.Identifier)
                .withProp('text', 'describe')
            )
            .fromNode(ast);
        expect(result.length).toBe(1);
    });

    it('allows to identify describe block using withChildProp', () => {
        const ast = parseTypeScriptFile(`describe('lol', ()=>{
            console.log('hi');
        }
        
      
        `, 'lol.ts');
        const result = tsq.ofKind(ts.SyntaxKind.CallExpression)
            .withChildProp('expression',
                tsq
                    .ofKind(ts.SyntaxKind.Identifier)
                    .withProp('text', 'describe'))
            .fromNode(ast);
        expect(result.length).toBe(1);
    });
    it('allows to identify real describe block', () => {
        const ast = parseTypeScriptFile(`
        
        describe('lol', ()=>{
            console.log('hi');
        });
        
        
           describe( ()=>{
            console.log('hi');
        }, 'lol');
        bescribe(33, ()=>{
            console.log('hi');
        });
         
        describe()
        
        describe('baobab', 'lol');
        
      
        `, 'lol.ts');
        const result = tsq.ofKind(ts.SyntaxKind.CallExpression)
            .withChildProp(
                'expression',
                tsq
                    .ofKind(ts.SyntaxKind.Identifier)
                    .withProp('text', 'describe')
            )
            .withChildArrayProp(
                'arguments',
                0,
                tsq.ofKind(ts.SyntaxKind.StringLiteral)
            )
            .withChildArrayProp(
                'arguments',
                1,
                tsq.ofKind(ts.SyntaxKind.ArrowFunction)
            )
            .fromNode(ast);
        expect(result.length).toBe(1);
    });


});
