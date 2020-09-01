<template>
  <div class="wrapper ts-editor-wrapper">
    <TSNode :node="tree"/>
  </div>

</template>

<script>
    import TSNode from "@/components/editors/ts/components/TSNode";

    export default {
        name: "TsEditor",
        components: {TSNode},
        props: ['tree'],
        data() {
            return {}
        },
        mounted() {
        }
    }
</script>

<style>
  [data-node="PropertyAssignment"] > * > [data-node="StringLiteral"] {
    color: #006cff;
  }

  .Identifier {
    color: rgba(82, 124, 12, 0.86);
  }

  .InterfaceDeclaration,
  .FunctionDeclaration,
  .SourceFile > .Block > .ExpressionStatement {
    display: block;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .StringLiteral {
    color: #9f5600;
  }

  [data-node="MethodDeclaration"] {
    margin-top: 20px;
    display: block;
  }

  .ObjectLiteralExpression > .Array > *,
  .ArrayLiteralExpression > .Array > *,
  .PropertySignature {
    margin-left: 20px;
    display: block;
  }

  .ImportDeclaration,
  .PropertySignature,
  .VariableStatement,
  .PropertyAssignment {
    display: block
  }

  .VariableStatement:after {
    content: ";";
  }
  .PropertyAssignment:not(:last-child):after,
  .VariableDeclarationList > .Array > .VariableDeclaration:not(:last-child):after
  {
    content: ", ";
  }

  .ts-editor-wrapper {
    font-family: Monaco;
  }

  .ArrowFunction > .Block,
  .FunctionDeclaration > .Block {
    display: inline !important;
  }


  .Block {
    display: block;
  }

  .Block > .Array > * {
    display: block;
    margin-left: 20px;
  }
  .TrueKeyword,
  .FalseKeyword,
  .NumericLiteral {
    font-weight: bold;
    color: #00669f;;
  }

  .JsxOpeningElement > .Identifier,
  .JsxClosingElement > .Identifier,
  .JsxSelfClosingElement > .Identifier {
    color: #400098;
  }




</style>
