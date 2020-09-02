<template>
  <span :class="{selected: selected, [nodeName]: true}">
    <span v-if="selectable" class="selectable-shortcut">{{selectable}}</span>
    <template v-if="!isArray">
      <span v-if="false"
            style="background: #ddd;position: absolute; left: 0; top: 50%;margin-top:-10px;border-radius: 50%"></span>
      <component v-if="component" :is="component" :nodeName="nodeName" :node="node"/>
    </template>
    <template v-if="isArray">
        <TSNodeList :nodes="node" :separator="separator"/>
    </template>
  </span>
</template>


<script type="text/jsx">
    import Unknown from "@/components/editors/ts/components/Unknown";
    import {kindMap} from "@/components/editors/ts/components/kindMap";
    import {mapGetters, mapMutations} from "vuex";
    import {h} from "vue";
    import {getVariableDeclarationKind} from "tsutils";

    function simpleNode(name, callback, wrapper = 'span') {
        return function (props) {
            const node = h(TSNode, {node: callback(props)});
            return wrapper ? h(wrapper, null, [
                node,
            ]) : node;
        };
    }


    function simpleText(text) {
        return function (props) {
            if (typeof text === 'function') {
                text = text(props.node);
            }
            return h('span', null, text);
        }
    }

    const declarationKindMap = {
        [0]: 'var',
        [1]: 'TODO',
        [2]: 'const'
    };


    const components = {
        Unknown,
        PlusToken: () => '+',
        EqualsEqualsEqualsToken: () => '===',
        ExclamationEqualsEqualsToken: () => '!==',
        EqualsToken: () => '=',
        MinusToken: () => '-',
        LessThanToken: () => '<',
        GreaterThanToken: () => '>',
        SlashToken: () => '/',
        AsteriskToken: () => '*',
        ThisKeyword: () => 'this',
        InKeyword: () => 'in',
        StringKeyword: () => 'string',
        BooleanKeyword: () => 'boolean',
        UnknownKeyword: () => 'unknown',
        AnyKeyword: () => 'any',
        VoidKeyword: () => 'void',
        ImportKeyword: () => 'import',
        ExportKeyword: () => 'export',
        BarBarToken: () => '||',
        AmpersandAmpersandToken: () => '&&',
        DebuggerStatement: () => 'debugger',
        ColonToken: () => ':',
        NoSubstitutionTemplateLiteral: simpleText(node => `\`${node.text}\``),
        FalseKeyword: () => 'false',
        PrivateKeyword: () => 'private',
        ReadonlyKeyword: () => 'readonly ',
        TrueKeyword: () => 'true',
        NullKeyword: () => 'null',
        CallExpression({node}) {
            console.assert(node.expression);
            console.assert(node.arguments);
            return <>
                <TSNode node={node.expression}/>
                {'('}
                <TSNode node={node.arguments}/>
                {')'}
            </>;
        },

        PropertyAccessExpression({node}) {
            return <>
                <TSNode node={node.expression}/>.
                <TSNode node={node.name}/>
            </>;
        },
        ArrowFunction({node}) {
            return <>
                {'('}
                <TSNode node={node.parameters} separator=","/>
                {')'}
                {' => '}
                <TSNode node={node.body}/>
            </>;
        },
        BinaryExpression({node}) {
            console.assert(node.left);
            console.assert(node.right);
            console.assert(node.operatorToken);
            return h('span', null, [
                h(TSNode, {node: node.left}),
                h(TSNode, {node: node.operatorToken}),
                h(TSNode, {node: node.right}),
            ]);
        },

        ImportDeclaration({node}) {
            console.assert(node.moduleSpecifier);
            return <>
                {'import '}
                {node.importClause && <>
                    <TSNode node={node.importClause}/>
                    {' ⬅️'}
                </>}

                <TSNode node={node.moduleSpecifier}/>
            </>
        },


        NumericLiteral({node}) {
            console.assert(node.text);
            return node.text;
        },

        StringLiteral({node}) {
            return <span>'{node.text}'</span>;
        },

        ExpressionStatement({node}) {
            console.assert(node.expression);
            return <>
                <TSNode node={node.expression} separator=","/>
            </>;
        },
        VariableStatement({node}) {
            console.assert(node.declarationList);
            return <>
                <TSNode node={node.declarationList} separator=","/>
            </>;
        },
        SourceFile({node}) {
            console.assert(node.statements);
            return <TSNode node={node.statements}/>
        },

        ShorthandPropertyAssignment: simpleNode('ShorthandPropertyAssignment', ({node}) => node.name),


        //     (props) => {
        //     return h('b', {class: 'lol'}, 'HOHO');
        // },
        //simpleNode('SourceFile', ({node}) => node.statements, 'div'),

        ImportClause: ({node}) => {
            return <>
                {node.name && <TSNode node={node.name}/>}
                {node.name && node.namedBindings && ', '}
                {node.namedBindings && node.namedBindings.elements.length &&
                <>
                    {'{'}
                    <TSNode node={node.namedBindings.elements} separator=","/>
                    {'}'}
                </>
                }
            </>;
        },
        ExportAssignment: simpleNode('ExportAssignment', ({node}) => node.expression),


        NamedImports: function (props) {
            return h('span', null, [
                '{',
                h(TSNode, {node: props.node.elements, separator: ', '}),
                '}'
            ]);
        },
        ImportSpecifier: function ({node}) {
            console.assert(node.name);
            return <TSNode node={node.name}/>
        },
        PropertyAssignment: function ({node}) {
            console.assert(node.name);
            console.assert(node.initializer);
            return <>
                <TSNode node={node.name}/>
                {': '}
                <TSNode node={node.initializer}/>
            </>
        },

        ThrowStatement: function ({node}) {
            console.assert(node.expression);
            return <div>throw <TSNode node={node.expression}/></div>;
        },
        SpreadElement: function ({node}) {
            console.assert(node.expression);
            return <span>...<TSNode node={node.expression}/></span>;
        },
        ParenthesizedExpression: function ({node}) {
            console.assert(node.expression);
            return <span>(<TSNode node={node.expression}/>)</span>;
        },
        NonNullExpression: function ({node}) {
            console.assert(node.expression);
            return h('span', null, [
                '',
                h(TSNode, {node: node.expression}),
                '🧨',
            ]);
        },

        AwaitExpression: function ({node}) {
            console.assert(node.expression);
            return h('span', null, [
                '⏱',
                h(TSNode, {node: node.expression}),
            ]);
        },
        PostfixUnaryExpression: function ({node}) {
            console.assert(node.operand);
            console.assert(node.operator === 45);

            return h('span', null, [
                '$PUE$',
                h(TSNode, {node: node.operand}),
            ]);
        },

        Identifier: function ({node}) {
            return node.text;
        },

        RegularExpressionLiteral: function ({node}) {
            return <span>{node.text}</span>;
        },


        ElementAccessExpression: function (props) {
            return h('span', null, [
                h(TSNode, {node: props.node.expression}),
                '[',
                h(TSNode, {node: props.node.argumentExpression}),
                ']'
            ]);
        },


        SpreadAssignment: function ({node}) {
            return <>
                {'...'}
                <TSNode node={node.expression}/>
            </>;
        },

        ReturnStatement: function ({node}) {
            return <>return <TSNode node={node.expression}/></>;
        },

        ArrayLiteralExpression: function ({node}) {
            return <>
                {'['}
                {node.elements && <TSNode node={node.elements}/>}]
                {']'}
            </>;
        },
        TypeOfExpression: function (props) {
            return h('span', null, [
                'typeof ',
                h(TSNode, {node: props.node.expression}),
            ]);
        },
        VariableDeclarationList: function ({node}) {
            console.assert(node.declarations);
            const kind = declarationKindMap[getVariableDeclarationKind(node)];
            return <>
                {kind}
                {' '}
                <TSNode node={node.declarations}/>
            </>;

        },
        VariableDeclaration: function ({node}) {
            console.assert(node.name);

            return <>
                <TSNode node={node.name}/>
                {node.initializer && <>
                    {' = '}
                    <TSNode node={node.initializer}/>
                </>}
            </>;
        },
        JSDocComment: function (props) {
            return h('div', null, [
                '/** ',
                props.node.comment,
                '*/',
            ]);
        },


        Block: function ({node}) {
            return <>
                {'{'}
                <TSNode node={node.statements}/>
                {'}'}
            </>
        },
        BindingElement: function ({node}) {
            return <span>
                <TSNode node={node.name}/>
                {node.initializer ? 'TODO: Initializer' : ''}
            </span>
        },

        ObjectBindingPattern: function ({node}) {
            console.assert(node.elements);
            return <span>
                {'{'}
                <TSNode node={node.elements} separator=","/>
                {'}'}
            </span>
        },


        IfStatement: function (props) {
            return h('div', null, [
                'if(',
                h(TSNode, {node: props.node.expression}),
                ') {',
                h(TSNode, {node: props.node.thenStatement}),
                '} ',
                props.node.elseStatement ? ' else { ' : '',
                props.node.elseStatement ? h(TSNode, {node: props.node.elseStatement}) : '',
                props.node.elseStatement ? '}' : '',
            ]);
        },


        FunctionExpression: function (props) {
            return h('div', null, [
                'function',
                props.node.name ? h(TSNode, {node: props.node.name}) : '',
                '(',
                h(TSNode, {node: props.node.parameters}),
                ') {',
                h('div', {class: 'p20'}, [h(TSNode, {node: props.node.body})]),
                '}',
            ]);
        },

        MethodDeclaration: function (props) {
            return h('div', null, [
                h(TSNode, {node: props.node.name}),
                '(',
                h(TSNode, {node: props.node.parameters}),
                ') {',
                h('div', {class: 'p20'}, [h(TSNode, {node: props.node.body})]),
                '}',
            ]);
        },


        ConditionalExpression: function ({node}) {
            console.assert(node.condition);
            console.assert(node.whenFalse);
            console.assert(node.whenTrue);

            return <div>
                <TSNode node={node.condition}/>{
                '?'
            }<TSNode node={node.whenTrue}/>{
                ':'
            }<TSNode node={node.whenFalse}/>
            </div>;
        },

        ComputedPropertyName: function ({node}) {
            console.assert(node.expression);
            return h('span', null, [
                '[',
                h(TSNode, {node: node.expression}),
                ']'
            ]);
        },


        FunctionDeclaration({node}) {
            console.assert(node.parameters);
            console.assert(node.body);

            return <>
                {'function '}
                {node.name && <TSNode node={node.name}/>}
                {'('}
                <TSNode node={node.parameters}/>
                {') '}
                <TSNode node={node.body}/>
            </>;
        },


        ClassDeclaration: function (props) {
            console.assert(props.node.members);
            return h('div', null, [
                props.node.jsDoc && h(TSNode, {node: props.node.jsDoc}),
                'class ',
                props.node.name ? h(TSNode, {node: props.node.name}) : '',
                props.node.heritageClauses && h(TSNode, {node: props.node.heritageClauses}),
                ' {',
                h('div', {class: 'p20'}, [h(TSNode, {node: props.node.members})]),
                '}',

            ]);
        },


        ObjectLiteralExpression(props) {
            return <>
                {'{'}
                <TSNode node={props.node.properties}/>
                {'}'}
            </>;
        },


        TypeAliasDeclaration: function ({node}) {
            // eslint-disable-next-line no-debugger
            return <>
                {node.modifiers &&
                <><TSNode node={node.modifiers}/>{' '}</>
                }
                {'type '}
                <TSNode node={node.name}/>
                {' = '}
                <TSNode node={node.type}/>
            </>;


        },
        ArrayBindingPattern: function () {
            return h('span', null, [
                '$arraybind$',
            ]);
        },

        ArrayType: function ({node}) {
            console.assert(node.elementType);
            return <span>
              <TSNode node={node.elementType}/>[]
            </span>
        },
        UnionType: function ({node}) {
            return h('span', null, [
                h(TSNode, {node: node.types, separator: '|'}),
            ]);
        },

        TypeAssertionExpression: function ({node}) {
            console.assert(node.type);
            return h('span', null, [
                '$TypeAssertionExpression$',
                h(TSNode, {node: node.type}),
            ]);
        },

        LabeledStatement: function ({node}) {
            console.assert(node.label);
            console.assert(node.statement);
            return h('span', null, [
                h(TSNode, {node: node.label}),
                'LabeledStatement',
                h(TSNode, {node: node.statement}),
            ]);
        },


        ConstructorType: function ({node}) {
            console.assert(node.parameters);
            console.assert(node.type);

            return <>
                {'new ('}
                <TSNode node={node.parameters} separator=", "/>
                {') => '}
                <TSNode node={node.type}/>
            </>;
        },

        FunctionType: function ({node}) {
            return <>
                {'('}
                <TSNode node={node.parameters} separator=", "/>
                {') => '}
                <TSNode node={node.type}/>
            </>;
        },

        ExpressionWithTypeArguments: function (props) {
            console.assert(props.node.expression);
            return h('span', null, [
                h(TSNode, {node: props.node.expression}),
                props.node.types && h(TSNode, {node: props.node.types}),
            ]);
        },


        Constructor: function (props) {
            console.assert(props.node.parameters);
            console.assert(props.node.body);
            return h('div', null, [
                props.node.modifiers && h(TSNode, {node: props.node.modifiers}),
                'constructor (',
                h(TSNode, {node: props.node.parameters}),
                props.node.typeParameters && h(TSNode, {node: props.node.typeParameters}),
                ') {',
                props.node.body && h(TSNode, {node: props.node.body}),
                '}',
            ]);
        },

        Parameter: function ({node}) {
            console.assert(node.name);
            return <span>
              <TSNode node={node.name}/>
                {node.type ? [
                    ': ',
                    <TSNode node={node.type}/>
                ] : null}
                {node.initializer ? [
                    '= $init$ ',
                    <TSNode node={node.initializer}/>
                ] : null}

            </span>;
        },

        PrefixUnaryExpression: function (props) {
            console.assert(props.node.operator === 53);
            console.assert(props.node.operand);
            return h('span', null, [
                '!',
                h(TSNode, {node: props.node.operand}),
            ]);
        },

        PropertyDeclaration: function (props) {
            console.assert(props.node.name);
            return h('div', null, [
                props.node.modifiers && h(TSNode, {node: props.node.modifiers}),
                h(TSNode, {node: props.node.name}),
                props.node.type && ['$TP$', h(TSNode, {node: props.node.type})],
                ' = ',
                props.node.initializer && h(TSNode, {node: props.node.initializer}),
            ]);
        },

        NewExpression: function (props) {
            console.assert(props.node.arguments);
            console.assert(props.node.expression);

            return h('span', null, [
                'new ',
                h(TSNode, {node: props.node.expression}),
                props.node.typeArguments && ['<', h(TSNode, {node: props.node.typeArguments}), '>'],
                '(',
                h(TSNode, {node: props.node.arguments}),
                ')',

            ]);
        },
        TypeReference: function (props) {
            console.assert(props.node.typeName);

            return h('span', null, [
                h(TSNode, {node: props.node.typeName}),
            ]);
        },
        TypeLiteral: function ({node}) {
            console.assert(node.members);
            return <>
                {'{'}
                <TSNode node={node.members}/>
                {'}'}
            </>;
        },

        AsExpression: function (props) {
            console.assert(props.node.expression);
            console.assert(props.node.type);

            return h('span', null, [
                h(TSNode, {node: props.node.expression}),
                ' as ',
                h(TSNode, {node: props.node.type}),
            ]);
        },


        HeritageClause: function (props) {
            return h('span', null, [
                'implements ',
                h(TSNode, {node: props.node.types}),
            ]);
        },

        // Interfaces
        InterfaceDeclaration({node}) {
            console.assert(node.name);
            console.assert(node.members);
            return <>
                {'interface '}
                <TSNode node={node.name}/>
                {' {'}
                <TSNode node={node.members}/>
                {'}'}
            </>;
        },

        PropertySignature({node}) {
            console.assert(node.name);

            return <>
                {node.modifiers && <TSNode node={node.modifiers}/>}
                <TSNode node={node.name}/>
                {': '}
                <TSNode node={node.type}/>
            </>;
        },
        ParenthesizedType({node}) {
            console.assert(node.type);

            return <span>
                {'('}
                <TSNode node={node.type}/>
                {')'}
            </span>;
        },
        LiteralType({node}) {
            console.assert(node.literal);

            return <span>
               <TSNode node={node.literal}/>
            </span>;
        },
        NumberKeyword: () => 'number',
        QualifiedName: ({node}) => {
            console.assert(node.left);
            console.assert(node.right);

            return <span>
              <TSNode node={node.left}/>
              .
              <TSNode node={node.right}/>
            </span>
        },

        // Templates
        TemplateExpression({node}) {
            console.assert(node.head);
            return <span>
                {'`'}
                <TSNode node={node.head}/>
                <TSNode node={node.templateSpans}/>
                {'`'}
            </span>;
        },
        TemplateHead({node}) {
            console.assert(node.text);
            return <span>
                {node.text}
            </span>;
        },
        TemplateTail({node}) {
            console.assert(node.text);
            return <span>
                {node.text}
            </span>;
        },
        TemplateSpan({node}) {
            console.assert(node.expression);
            console.assert(node.literal);
            return <>
                <TSNode node={node.expression}/>
                <TSNode node={node.literal}/>
            </>;
        },

        // JSX
        JsxFragment({node}) {
            console.assert(!!node.openingFragment);
            console.assert(!!node.closingFragment);
            console.assert(!!node.children);
            return <>
                <TSNode node={node.openingFragment}/>
                <TSNode node={node.children}/>
                <TSNode node={node.closingFragment}/>
            </>;
        },
        JsxElement({node}) {
            console.assert(!!node.openingElement);
            console.assert(!!node.closingElement);
            console.assert(!!node.children);
            return <>
                <TSNode node={node.openingElement}/>
                {node.children.length ? <TSNode node={node.children}/> : ''}
                <TSNode node={node.closingElement}/>
            </>;
        },
        JsxSelfClosingElement({node}) {
            console.assert(!!node.tagName);
            console.assert(!!node.attributes);
            return <>
                {'<'}
                <TSNode node={node.tagName}/>
                {' '}
                {node.attributes.properties.length ? <TSNode node={node.attributes} separator="%%%"/> : null}
                {'/>'}
            </>;
        },
        JsxOpeningFragment() {
            return <>{'<>'}</>;
        },

        JsxClosingFragment() {
            return <>{'</>'}</>;
        },
        JsxSpreadAttribute({node}) {
            console.assert(node.expression);
            return <>
                {'{...'}
                <TSNode node={node.expression}/>
                {'}'}
            </>;
        },

        JsxOpeningElement({node}) {
            console.assert(!!node.tagName);
            console.assert(!!node.attributes);
            return <>
                {'<'}
                <TSNode node={node.tagName}/>
                {node.attributes.length && <TSNode node={node.attributes} separator="%%%"/>}
                {'>'}
            </>;
        },
        JsxClosingElement({node}) {
            console.assert(!!node.tagName);
            return <>
                {'<'}<TSNode node={node.tagName}/>/{'>'}
            </>;
        },

        JsxText({node}) {
            console.assert(!!node.text);
            if (node.text.trim() === '') {
                return null;
            }
            return <span>
                {node.text}
            </span>;
        },
        JsxAttributes({node}) {
            return <span>
               <TSNode node={node.properties}/>
            </span>;
        },
        JsxAttribute({node}) {
            console.assert(node.name);

            return <span>

               <TSNode node={node.name}/>
                {node.initializer && [
                    '=',
                    <TSNode node={node.initializer}/>
                ]}
            </span>;
        },
        JsxExpression({node}) {
            console.assert(node.expression);

            return <span>
                {'{'}
                <TSNode node={node.expression}/>
                {'}'}
            </span>;
        },
    };

    const TSNode = {
        name: "TSNode",
        props: {
            'node': {type: [Object, Array], required: true},
            separator: String
        },
        computed: {
            isArray() {
                console.assert(typeof this.node !== 'string');
                return Array.isArray(this.node);
            },
            nodeName() {
                return kindMap[this.node.kind] || this.node.constructor.name;
            },
            component() {
                return components[this.nodeName] || components.Unknown;
            },
            ...mapGetters(['selectedNode', 'selectableNodes']),
            selected() {
                return this.selectedNode === this.node;
            },
            selectable() {
                return this.selectableNodes?.get(this.node)
            }
        },
        mounted() {
            //debugger;
        },
        methods: {
            ...mapMutations(['selectNode']),
            selectCurrentNode() {
                this.selectNode(this.node);
            }
        },
        components,
    };


    export default TSNode;
</script>

<style>

  .nodeName {
    display: none;
  }

  .nodeWrapper {
    position: relative;
  }

  .selected,
  .selected * {
    background: rgba(254, 255, 10, 0);
    outline: 1px #ddd solid;
  }

  .selectable-shortcut {
    padding: 0 4px;
    background: aliceblue;
    width: 20px;
    border: 1px rgba(11, 152, 184, 0.38) solid;
    display: inline-block;
    margin-right: 4px;
    border-radius: 4px;
    text-align: center;
    color: #444;
  }

</style>
