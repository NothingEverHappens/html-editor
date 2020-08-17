<template>
  <div>
    {{kind}}
    <TSNode :node="node.declarations"/>
  </div>
</template>


<script>
    import TSNode from "@/components/editors/ts/components/TSNode";
    import {getVariableDeclarationKind} from "tsutils";

    const declarationKindMap = {
        [0]: 'TODO',
        [1]: 'TODO',
        [2]: 'const'
    };


    export default {
        name: "VariableDeclarationList",
        components: {TSNode},
        props: ['node'],
        computed: {
            kind() {
                return declarationKindMap[getVariableDeclarationKind(this.node)];
            }
        }

    }
</script>

<style scoped>

</style>
