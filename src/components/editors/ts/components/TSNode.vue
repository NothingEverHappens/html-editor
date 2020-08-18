<template>
  <span v-if="true" :class="{selected: selected, nodeWrapper: true}" :data-node="nodeName">
    <template v-if="!isArray">
      <Component v-if="component" :is="component" :nodeName="nodeName" :node="node"/>
    </template>
    <template v-if="isArray">
      <TSNodeList :nodes="node" :separator="separator"/>
    </template>
  </span>
</template>


<script>
    import Vue from 'vue';
    import Unknown from "@/components/editors/ts/components/Unknown";
    import {kindMap} from "@/components/editors/ts/components/kindMap";
    import {mapGetters, mapMutations} from "vuex";

    function simpleNode(name, callback, wrapper = 'span') {
        return Vue.component(name, {
            functional: true,
            render: function (createElement, {props}) {
                const node = createElement('TSNode', {props: {node: callback(props)}});

                return wrapper ? createElement(wrapper, null, [
                    node,
                ]) : node;
            },
            props: ['node'],
        })
    }


    function simpleTemplate(name, render) {
        return Vue.component(name, {
            functional: true,
            render,
            props: ['node'],
        })
    }

    function simpleText(name, text) {
        return simpleTemplate(name, function (createElement, {props}) {
            if (typeof text === 'function') {
                text = text(props.node);
            }
            return createElement('span', null, text);
        },)
    }

    const components = {
        Unknown,
        VariableDeclarationList: () => import('@/components/editors/ts/components/VariableDeclarationList'),
        VariableDeclaration: () => import('@/components/editors/ts/components/VariableDeclaration'),
        Identifier: () => import('@/components/editors/ts/components/Identifier'),
        ArrowFunction: () => import('@/components/editors/ts/components/ArrowFunction'),
        BinaryExpression: () => import('@/components/editors/ts/components/BinaryExpression'),
        TSNodeList: () => import('@/components/editors/ts/components/TSNodeList'),
        PlusToken: simpleText('PlusToken', '+'),
        EqualsEqualsEqualsToken: simpleText('EqualsEqualsEqualsToken', '+'),
        EqualsToken: simpleText('EqualsToken', '+'),
        LessThanToken: simpleText('LessThanToken', '<'),
        AsteriskToken: simpleText('AsteriskToken', '*'),
        ThisKeyword: simpleText('ThisKeyword', 'this'),
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
        CallExpression: Vue.component('CallExpression', {
            functional: true,
            render: function (createElement, {props}) {
                return createElement('span', null, [
                    createElement('TSNode', {props: {node: props.node.expression}}),
                    '(',
                    createElement('TSNodeList', {props: {nodes: props.node.arguments}}),
                    ')',
                ]);
            },
            props: ['node'],
        }),


        PropertyAccessExpression: Vue.component('PropertyAccessExpression', {
            functional: true,
            render: function (createElement, {props}) {
                return createElement('span', null, [
                    createElement('TSNode', {props: {node: props.node.expression}}),
                    '.',
                    createElement('TSNode', {props: {node: props.node.name}}),
                ]);
            },
            props: ['node'],
        }),
        ImportDeclaration: Vue.component('ImportDeclaration', {
            functional: true,
            render: function (createElement, {props}) {
                return createElement('div', null, [
                    'import ',
                    createElement('TSNode', {props: {node: props.node.importClause}}),
                    ' from ',
                    createElement('TSNode', {props: {node: props.node.moduleSpecifier}}),
                ]);
            },
            props: ['node'],
        }),

        NumericLiteral: Vue.component('NumericLiteral', {
            functional: true,
            render: function (createElement, {props}) {
                return createElement('span', null, props.node.text);
            },
            props: ['node'],
        }),
        StringLiteral: Vue.component('StringLiteral', {
            functional: true,
            render: function (createElement, {props}) {

                return createElement('span', null, '\'' + props.node.text + '\'');
            },
            props: ['node'],
        }),
        ExpressionStatement: simpleNode('ExpressionStatement', ({node}) => node.expression, 'div'),
        VariableStatement: simpleNode('VariableStatement', ({node}) => node.declarationList, 'div'),

        ShorthandPropertyAssignment: simpleNode('ShorthandPropertyAssignment', ({node}) => node.name),
        Block: simpleNode('Block', ({node}) => node.statements, 'div'),
        SourceFile: simpleNode('SourceFile', ({node}) => node.statements, 'div'),

        ImportClause: simpleNode('ImportClause', ({node}) => node.name || node.namedBindings),
        ExportAssignment: simpleNode('ExportAssignment', ({node}) => node.expression),


        NamedImports: simpleTemplate('NamedImports', function (createElement, {props}) {
            return createElement('span', null, [
                '{',
                createElement('TSNode', {props: {node: props.node.elements, separator: ', '}}),
                '}'
            ]);
        }),
        ImportSpecifier: simpleTemplate('ImportSpecifier', function (createElement, {props}) {
            return createElement('span', null, [
                createElement('TSNode', {props: {node: props.node.name}}),
            ]);
        }),
        PropertyAssignment: simpleTemplate('PropertyAssignment', function (createElement, {props}) {
            return createElement('div', null, [
                createElement('TSNode', {props: {node: props.node.name}}),
                ':',
                createElement('TSNode', {props: {node: props.node.initializer}}),
            ]);
        }),


        ElementAccessExpression: simpleTemplate('ElementAccessExpression', function (createElement, {props}) {
            return createElement('div', null, [
                createElement('TSNode', {props: {node: props.node.expression}}),
                '[',
                createElement('TSNode', {props: {node: props.node.argumentExpression}}),
                ']'
            ]);
        }),
        SpreadAssignment: simpleTemplate('SpreadAssignment', function (createElement, {props}) {
            return createElement('div', null, [
                '...',
                createElement('TSNode', {props: {node: props.node.expression}}),
            ]);
        }),

        ReturnStatement: simpleTemplate('ReturnStatement', function (createElement, {props}) {
            return createElement('div', null, [
                'return ',
                props.node.expression ? createElement('TSNode', {props: {node: props.node.expression}}) : '',
            ]);
        }),


        ArrayLiteralExpression: simpleTemplate('ArrayLiteralExpression', function (createElement, {props}) {
            return createElement('div', null, [
                '[',
                createElement('TSNode', {props: {node: props.node.elements}}),
                ']'
            ]);
        }),
        TypeOfExpression: simpleTemplate('TypeOfExpression', function (createElement, {props}) {
            return createElement('div', null, [
                'typeof ',
                createElement('TSNode', {props: {node: props.node.expression}}),
            ]);
        }),
        JSDocComment: simpleTemplate('JSDocComment', function (createElement, {props}) {
            return createElement('div', null, [
                '/** ',
                props.node.comment,
                '*/',
            ]);
        }),

        BindingElement: simpleTemplate('BindingElement', function (createElement, {props}) {
            return createElement('div', null, [
                '{',
                createElement('TSNode', {props: {node: props.node.name}}),
                '}',
                props.node.initializer ? 'TODO: Initializer' : '',
            ]);
        }),

        ObjectBindingPattern: simpleTemplate('ObjectBindingPattern', function (createElement, {props}) {
            return createElement('div', null, [
                '[',
                createElement('TSNode', {props: {node: props.node.elements}}),
                ']'
            ]);
        }),


        IfStatement: simpleTemplate('ArrayLiteralExpression', function (createElement, {props}) {
            return createElement('div', null, [
                'if(',
                createElement('TSNode', {props: {node: props.node.expression}}),
                ') {',
                createElement('TSNode', {props: {node: props.node.thenStatement}}),
                '} ',
                props.node.elseStatement ? ' else { ' : '',
                props.node.elseStatement ? createElement('TSNode', {props: {node: props.node.elseStatement}}) : '',
                props.node.elseStatement ? '}' : '',
            ]);
        }),


        FunctionExpression: simpleTemplate('FunctionExpression', function (createElement, {props}) {
            return createElement('div', null, [
                'function',
                props.node.name ? createElement('TSNode', {props: {node: props.node.name}}) : '',
                '(',
                createElement('TSNode', {props: {node: props.node.parameters}}),
                ') {',
                createElement('div', {class: 'p20'}, [createElement('TSNode', {props: {node: props.node.body}})]),
                '}',
            ]);
        }),

        MethodDeclaration: simpleTemplate('MethodDeclaration', function (createElement, {props}) {
            return createElement('div', null, [
                createElement('TSNode', {props: {node: props.node.name}}),
                '(',
                createElement('TSNode', {props: {node: props.node.parameters}}),
                ') {',
                createElement('div', {class: 'p20'}, [createElement('TSNode', {props: {node: props.node.body}})]),
                '}',
            ]);
        }),


        ConditionalExpression: simpleTemplate('ConditionalExpression', function (createElement, {props}) {
            return createElement('div', null, [
                props.node.condition,
                '?',
                createElement('TSNode', {props: {node: props.node.whenFalse}}),
                ':',
                createElement('TSNode', {props: {node: props.node.whenTrue}})
            ]);
        }),


        FunctionDeclaration: Vue.component('FunctionDeclaration', {
            functional: true,
            render: function (createElement, {props}) {
                return createElement('div', null, [
                    'function ',
                    props.node.name ? createElement('TSNode', {props: {node: props.node.name}}) : '',
                    '(',
                    createElement('TSNode', {props: {node: props.node.parameters}}),
                    ') {',
                    createElement('div', {class: 'p20'}, [createElement('TSNode', {props: {node: props.node.body}})]),
                    '}',
                ]);
            },
            props: ['node'],
        }),


        ClassDeclaration: simpleTemplate('ClassDeclaration', function (createElement, {props}) {
            console.assert(props.node.members);
            return createElement('div', null, [
                props.node.jsDoc && createElement('TSNode', {props: {node: props.node.jsDoc}}),
                'class ',
                props.node.name ? createElement('TSNode', {props: {node: props.node.name}}) : '',
                props.node.heritageClauses && createElement('TSNode', {props: {node: props.node.heritageClauses}}),
                ' {',
                createElement('div', {class: 'p20'}, [createElement('TSNode', {props: {node: props.node.members}})]),
                '}',

            ]);
        }),


        ObjectLiteralExpression: Vue.component('ObjectLiteralExpression', {
            functional: true,
            render: function (createElement, {props}) {
                return createElement('span', null, [
                    '{',
                    createElement(props.node.properties.length ? 'div' : 'span', {'class': 'p20'}, [
                        createElement('TSNode', {props: {node: props.node.properties}}),
                    ]),
                    '}'
                ]);
            },
            props: ['node'],
        }),


        TypeAliasDeclaration: simpleTemplate('TypeAliasDeclaration', function (createElement, {props}) {
            return createElement('div', null, [
                'type ',
                createElement('TSNode', {props: {node: props.node.name}}),
                ' = ',
                createElement('TSNode', {props: {node: props.node.type}}),

            ]);
        }),
        ArrayBindingPattern: simpleTemplate('ArrayBindingPattern', function (createElement) {
            return createElement('span', null, [
                '$arraybind$',
            ]);
        }),

        FunctionType: simpleTemplate('FunctionType', function (createElement, {props}) {
            return createElement('span', null, [
                '(',
                createElement('TSNode', {props: {node: props.node.parameters}}),
                ') :',
                createElement('TSNode', {props: {node: props.node.type}}),

            ]);
        }),

        ExpressionWithTypeArguments: simpleTemplate('ExpressionWithTypeArguments', function (createElement, {props}) {
            console.assert(props.node.expression);
            return createElement('span', null, [
                createElement('TSNode', {props: {node: props.node.expression}}),
                props.node.types && createElement('TSNode', {props: {node: props.node.types}}),
            ]);
        }),


        Constructor: simpleTemplate('Constructor', function (createElement, {props}) {
            console.assert(props.node.parameters);
            console.assert(props.node.body);
            return createElement('div', null, [
                props.node.modifiers && createElement('TSNode', {props: {node: props.node.modifiers}}),
                'constructor (',
                createElement('TSNode', {props: {node: props.node.parameters}}),
                props.node.typeParameters && createElement('TSNode', {props: {node: props.node.typeParameters}}),
                ') {',
                props.node.body && createElement('TSNode', {props: {node: props.node.body}}),
                '}',
            ]);
        }),

        Parameter: simpleTemplate('Parameter', function (createElement, {props}) {
            console.assert(props.node.name);
            console.assert(!props.node.initializer);
            return createElement('span', null, [
                createElement('TSNode', {props: {node: props.node.name}}),
                ':',
                props.node.type && createElement('TSNode', {props: {node: props.node.type}}),
            ]);
        }),

        PrefixUnaryExpression: simpleTemplate('PrefixUnaryExpression', function (createElement, {props}) {
            console.assert(props.node.operator === 53);
            console.assert(props.node.operand);
            return createElement('span', null, [
                '!',
                createElement('TSNode', {props: {node: props.node.operand}}),
            ]);
        }),

        PropertyDeclaration: simpleTemplate('PropertyDeclaration', function (createElement, {props}) {
            console.assert(props.node.name);
            return createElement('div', null, [
                props.node.modifiers && createElement('TSNode', {props: {node: props.node.modifiers}}),
                createElement('TSNode', {props: {node: props.node.name}}),
                ' = ',
                props.node.type && createElement('TSNode', {props: {node: props.node.type}}),
                props.node.initializer && createElement('TSNode', {props: {node: props.node.initializer}}),
            ]);
        }),

        NewExpression: simpleTemplate('NewExpression', function (createElement, {props}) {
            console.assert(props.node.arguments);
            console.assert(props.node.expression);

            return createElement('span', null, [
                'new ',
                createElement('TSNode', {props: {node: props.node.expression}}),
                '(',
                createElement('TSNode', {props: {node: props.node.arguments}}),
                ')',
                props.node.typeArguments && createElement('TSNode', {props: {node: props.node.typeArguments}}),
            ]);
        }),
        TypeReference: simpleTemplate('TypeReference', function (createElement, {props}) {
            console.assert(props.node.typeName);

            return createElement('span', null, [
                createElement('TSNode', {props: {node: props.node.typeName}}),
            ]);
        }),
        TypeLiteral: simpleTemplate('TypeLiteral', function (createElement) {
            // console.assert(props.node.typeName);

            return createElement('span', null, [
                '{$TL$}'
            ]);
        }),

        AsExpression: simpleTemplate('TypeLiteral', function (createElement, {props}) {
            console.assert(props.node.expression);
            console.assert(props.node.type);

            return createElement('span', null, [
                createElement('TSNode', {props: {node: props.node.expression}}),
                ' as ',
                createElement('TSNode', {props: {node: props.node.type}}),
            ]);
        }),


        HeritageClause: simpleTemplate('HeritageClause', function (createElement, {props}) {
            return createElement('span', null, [
                'implements ',
                createElement('TSNode', {props: {node: props.node.types}}),
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
