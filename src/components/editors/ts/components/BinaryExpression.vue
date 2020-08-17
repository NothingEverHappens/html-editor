<template>
  <span>
    <TSNode :node="node.left"/>
    <TSNode :node="node.operatorToken"/>
    <TSNode :node="node.right"/>
  </span>
</template>

<script>
    import TSNode from "@/components/editors/ts/components/TSNode";

    export default {
        name: "BinaryExpression",
        components: {TSNode},
        props: ['node'],
    }
</script>

<style scoped>

</style>
