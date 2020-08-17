<template>
  <span>
    <TSNode :node="node.name"/> =
    <TSNode :node="node.initializer"></TSNode>
  </span>
</template>

<script>

    import TSNode from "@/components/editors/ts/components/TSNode";

    export default {
        name: "VariableDeclaration",
        components: {TSNode},
        props: ['node'],
        mounted() {
            // debugger;
        }
    }
</script>

<style scoped>

</style>
