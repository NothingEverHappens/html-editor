<template>
  <span>
    (<TSNode :node="node.parameters"/>) =>
    <TSNode :node="node.body"></TSNode>
  </span>
  <!--  <TSNode :node="node.declarationList"></TSNode>-->
</template>

<script>
    import TSNode from "@/components/editors/ts/components/TSNode";

    export default {
        name: "ArrowFunction",
        components: {TSNode},
        props: ['node'],
        mounted() {
            // debugger;
        }
    }
</script>

<style scoped>

</style>
