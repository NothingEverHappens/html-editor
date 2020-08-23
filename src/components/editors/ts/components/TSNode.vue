<template>
  <span :class="{selected: selected, nodeWrapper: true}" :data-node="nodeName">
    <template v-if="!isArray">
      <component v-if="component" :is="component" :nodeName="nodeName" :node="node"/>
    </template>
    <template v-if="isArray">
        <TSNodeList :nodes="node" :separator="separator"/>
    </template>
  </span>
</template>


<script>
    import Unknown from "@/components/editors/ts/components/Unknown";
    import {kindMap} from "@/components/editors/ts/components/kindMap";
    import {mapGetters, mapMutations} from "vuex";
    import {h} from "vue";

    function simpleNode(name, callback, wrapper = 'span') {
        return function (props) {
            const node = h(TSNode, {node: callback(props)});
            return wrapper ? h(wrapper, null, [
                node,
            ]) : node;
        };
    }


    function simpleTemplate(name, render) {
        return render;
    }

    function simpleText(name, text) {
        return simpleTemplate(name, function (props) {
            if (typeof text === 'function') {
                text = text(props.node);
            }
            return h('span', null, text);
        },)
    }

    const components = {
        Unknown,
        VariableDeclarationList: () => import('@/components/editors/ts/components/VariableDeclarationList'),
        VariableDeclaration: () => import('@/components/editors/ts/components/VariableDeclaration'),
        BinaryExpression: () => import('@/components/editors/ts/components/BinaryExpression'),
        PlusToken: simpleText('PlusToken', '+'),
        EqualsEqualsEqualsToken: simpleText('EqualsEqualsEqualsToken', '+'),
        EqualsToken: simpleText('EqualsToken', '+'),
        LessThanToken: simpleText('LessThanToken', '<'),
        AsteriskToken: simpleText('AsteriskToken', '*'),
        ThisKeyword: simpleText('ThisKeyword', 'this'),
        BooleanKeyword: simpleText('BooleanKeyword', 'boolean'),
        AnyKeyword: simpleText('AnyKeyword', 'any'),
        VoidKeyword: simpleText('VoidKeyword', 'void'),
        ImportKeyword: simpleText('ImportKeyword', 'import'),
        BarBarToken: simpleText('BarBarToken', '||'),
        AmpersandAmpersandToken: simpleText('AmpersandAmpersandToken', '&&'),
        DebuggerStatement: simpleText('DebuggerStatement', 'debugger'),
        ColonToken: simpleText('ColonToken', ':'),
        NoSubstitutionTemplateLiteral: simpleText('NoSubstitutionTemplateLiteral', node => `\`${node.text}\``),
        FalseKeyword: simpleText('FalseKeyword', 'false'),
        PrivateKeyword: simpleText('PrivateKeyword', 'private'),
        ReadonlyKeyword: simpleText('ReadonlyKeyword', 'readonly '),
        TrueKeyword: simpleText('TrueKeyword', 'true'),
        NullKeyword: simpleText('NullKeyword', 'null'),
        CallExpression(props) {
            return h('span', null, [
                h(TSNode, {node: props.node.expression}),
                '(',
                h(TSNode, {node: props.node.arguments}),
                ')',
            ]);
        },

        PropertyAccessExpression(props) {
            return h('span', null, [
                h(TSNode, {node: props.node.expression}),
                '.',
                h(TSNode, {node: props.node.name}),
            ]);
        },
        ArrowFunction(props) {
            return h('span', null, [
                '(',
                h(TSNode, {node: props.node.parameters}),
                ')=>',
                h(TSNode, {node: props.node.body}),
            ]);
        },

        ImportDeclaration(props) {
            return h('div', null, [
                'import ',
                h(TSNode, {node: props.node.importClause}),
                ' from ',
                h(TSNode, {node: props.node.moduleSpecifier}),
            ]);
        },


        NumericLiteral(props) {
            return h('span', null, props.node.text);
        },

        StringLiteral(props) {

            return h('span', null, '\'' + props.node.text + '\'');
        },

        ExpressionStatement: simpleNode('ExpressionStatement', ({node}) => node.expression, 'div'),
        VariableStatement: simpleNode('VariableStatement', ({node}) => node.declarationList, 'div'),

        ShorthandPropertyAssignment: simpleNode('ShorthandPropertyAssignment', ({node}) => node.name),
        Block: simpleNode('Block', ({node}) => node.statements, 'div'),
        SourceFile: simpleNode('SourceFile', ({node}) => node.statements, 'div'),

        //     (props) => {
        //     return h('b', {class: 'lol'}, 'HOHO');
        // },
        //simpleNode('SourceFile', ({node}) => node.statements, 'div'),

        ImportClause: simpleNode('ImportClause', ({node}) => node.name || node.namedBindings),
        ExportAssignment: simpleNode('ExportAssignment', ({node}) => node.expression),


        NamedImports: simpleTemplate('NamedImports', function (props) {
            return h('span', null, [
                '{',
                h(TSNode, {node: props.node.elements, separator: ', '}),
                '}'
            ]);
        }),
        ImportSpecifier: simpleTemplate('ImportSpecifier', function (props) {
            return h('span', null, [
                h(TSNode, {node: props.node.name}),
            ]);
        }),
        PropertyAssignment: simpleTemplate('PropertyAssignment', function (props) {
            return h('div', null, [
                h(TSNode, {node: props.node.name}),
                ':',
                h(TSNode, {node: props.node.initializer}),
            ]);
        }),

        Identifier: simpleTemplate('Identifier', function (props) {
            return h('span', null, [
                props.node.text
            ]);
        }),


        ElementAccessExpression: simpleTemplate('ElementAccessExpression', function (props) {
            return h('div', null, [
                h(TSNode, {node: props.node.expression}),
                '[',
                h(TSNode, {node: props.node.argumentExpression}),
                ']'
            ]);
        }),
        SpreadAssignment: simpleTemplate('SpreadAssignment', function (props) {
            return h('div', null, [
                '...',
                h(TSNode, {node: props.node.expression}),
            ]);
        }),

        ReturnStatement: simpleTemplate('ReturnStatement', function (props) {
            return h('div', null, [
                'return ',
                props.node.expression ? h(TSNode, {node: props.node.expression}) : '',
            ]);
        }),


        ArrayLiteralExpression: simpleTemplate('ArrayLiteralExpression', function (props) {
            return h('div', null, [
                '[',
                h(TSNode, {node: props.node.elements}),
                ']'
            ]);
        }),
        TypeOfExpression: simpleTemplate('TypeOfExpression', function (props) {
            return h('div', null, [
                'typeof ',
                h(TSNode, {node: props.node.expression}),
            ]);
        }),
        JSDocComment: simpleTemplate('JSDocComment', function (props) {
            return h('div', null, [
                '/** ',
                props.node.comment,
                '*/',
            ]);
        }),

        BindingElement: simpleTemplate('BindingElement', function (props) {
            return h('div', null, [
                '{',
                h(TSNode, {node: props.node.name}),
                '}',
                props.node.initializer ? 'TODO: Initializer' : '',
            ]);
        }),

        ObjectBindingPattern: simpleTemplate('ObjectBindingPattern', function (props) {
            return h('div', null, [
                '[',
                h(TSNode, {node: props.node.elements}),
                ']'
            ]);
        }),


        IfStatement: simpleTemplate('ArrayLiteralExpression', function (props) {
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
        }),


        FunctionExpression: simpleTemplate('FunctionExpression', function (props) {
            return h('div', null, [
                'function',
                props.node.name ? h(TSNode, {node: props.node.name}) : '',
                '(',
                h(TSNode, {node: props.node.parameters}),
                ') {',
                h('div', {class: 'p20'}, [h(TSNode, {node: props.node.body})]),
                '}',
            ]);
        }),

        MethodDeclaration: simpleTemplate('MethodDeclaration', function (props) {
            return h('div', null, [
                h(TSNode, {node: props.node.name}),
                '(',
                h(TSNode, {node: props.node.parameters}),
                ') {',
                h('div', {class: 'p20'}, [h(TSNode, {node: props.node.body})]),
                '}',
            ]);
        }),


        ConditionalExpression: simpleTemplate('ConditionalExpression', function (props) {
            return h('div', null, [
                props.node.condition,
                '?',
                h(TSNode, {node: props.node.whenFalse}),
                ':',
                h(TSNode, {node: props.node.whenTrue})
            ]);
        }),


        FunctionDeclaration(props) {
            return h('div', null, [
                'function ',
                props.node.name ? h(TSNode, {node: props.node.name}) : '',
                '(',
                h(TSNode, {node: props.node.parameters}),
                ') {',
                h('div', {class: 'p20'}, [h(TSNode, {node: props.node.body})]),
                '}',
            ]);
        },


        ClassDeclaration: simpleTemplate('ClassDeclaration', function (props) {
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
        }),


        ObjectLiteralExpression(props) {
            return h('span', null, [
                '{',
                h(props.node.properties.length ? 'div' : 'span', {'class': 'p20'}, [
                    h(TSNode, {node: props.node.properties}),
                ]),
                '}'
            ]);
        },


        TypeAliasDeclaration: simpleTemplate('TypeAliasDeclaration', function (props) {
            return h('div', null, [
                'type ',
                h(TSNode, {node: props.node.name}),
                ' = ',
                h(TSNode, {node: props.node.type}),

            ]);
        }),
        ArrayBindingPattern: simpleTemplate('ArrayBindingPattern', function () {
            return h('span', null, [
                '$arraybind$',
            ]);
        }),

        ArrayType: simpleTemplate('ArrayType', function () {
            return h('span', null, [
                '$arrayType$',
            ]);
        }),

        FunctionType: simpleTemplate('FunctionType', function (props) {
            return h('span', null, [
                '(',
                h(TSNode, {node: props.node.parameters}),
                ') :',
                h(TSNode, {node: props.node.type}),

            ]);
        }),

        ExpressionWithTypeArguments: simpleTemplate('ExpressionWithTypeArguments', function (props) {
            console.assert(props.node.expression);
            return h('span', null, [
                h(TSNode, {node: props.node.expression}),
                props.node.types && h(TSNode, {node: props.node.types}),
            ]);
        }),


        Constructor: simpleTemplate('Constructor', function (props) {
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
        }),

        Parameter: simpleTemplate('Parameter', function (props) {
            console.assert(props.node.name);
            console.assert(!props.node.initializer);
            return h('span', null, [
                h(TSNode, {node: props.node.name}),
                ':',
                props.node.type && h(TSNode, {node: props.node.type}),
            ]);
        }),

        PrefixUnaryExpression: simpleTemplate('PrefixUnaryExpression', function (props) {
            console.assert(props.node.operator === 53);
            console.assert(props.node.operand);
            return h('span', null, [
                '!',
                h(TSNode, {node: props.node.operand}),
            ]);
        }),

        PropertyDeclaration: simpleTemplate('PropertyDeclaration', function (props) {
            console.assert(props.node.name);
            return h('div', null, [
                props.node.modifiers && h(TSNode, {node: props.node.modifiers}),
                h(TSNode, {node: props.node.name}),
                ' = ',
                props.node.type && h(TSNode, {node: props.node.type}),
                props.node.initializer && h(TSNode, {node: props.node.initializer}),
            ]);
        }),

        NewExpression: simpleTemplate('NewExpression', function (props) {
            console.assert(props.node.arguments);
            console.assert(props.node.expression);

            return h('span', null, [
                'new ',
                h(TSNode, {node: props.node.expression}),
                '(',
                h(TSNode, {node: props.node.arguments}),
                ')',
                props.node.typeArguments && h(TSNode, {node: props.node.typeArguments}),
            ]);
        }),
        TypeReference: simpleTemplate('TypeReference', function (props) {
            console.assert(props.node.typeName);

            return h('span', null, [
                h(TSNode, {node: props.node.typeName}),
            ]);
        }),
        TypeLiteral: simpleTemplate('TypeLiteral', function () {
            // console.assert(props.node.typeName);

            return h('span', null, [
                '{$TL$}'
            ]);
        }),

        AsExpression: simpleTemplate('TypeLiteral', function (props) {
            console.assert(props.node.expression);
            console.assert(props.node.type);

            return h('span', null, [
                h(TSNode, {node: props.node.expression}),
                ' as ',
                h(TSNode, {node: props.node.type}),
            ]);
        }),


        HeritageClause: simpleTemplate('HeritageClause', function (props) {
            return h('span', null, [
                'implements ',
                h(TSNode, {node: props.node.types}),
            ]);
        }),
    };

    const TSNode = {
        name: "TSNode",
        props: ['node', 'separator'],
        computed: {
            isArray() {
                console.assert(typeof this.node !== 'string');
                return Array.isArray(this.node);
            },
            nodeName() {
                return kindMap[this.node.kind] || this.node.constructor.name;
            },
            component() {
                console.log(this.nodeName);
                return components[this.nodeName] || components.Unknown;
            },
            ...mapGetters(['selectedNode']),
            selected() {
                return this.selectedNode === this.node;
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

  .selected > * {
    background: rgba(254, 255, 10, 0.13);
    outline: 1px #ddd solid;
  }

</style>
