<template>
  <span>{{node.text}}</span>
  <!--  <TSNode :node="node.declarationList"></TSNode>-->
</template>

<script>
    export default {
        name: "Identifier",
        props: ['node'],
        mounted() {
            // debugger;
        }
    }
</script>

<style scoped>

</style>
