<template>
    <template v-for="(node, index) of nodes">
      <TSNode :node="node" :key="index"></TSNode>
      <template v-if="separator && index + 1 < nodes.length">{{separator}}</template>
    </template>
</template>


<script>
    import TSNode from "@/components/editors/ts/components/TSNode";

    export default {
        name: "TSNodeList",
        components: {TSNode},
        props: ['nodes', 'separator'],
        mounted() {
            if (typeof this.nodes === 'string') {
                // eslint-disable-next-line no-debugger
                debugger;
            }
        }
    }
</script>

<style scoped>

</style>
