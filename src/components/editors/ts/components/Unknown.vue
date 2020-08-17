<template>
  <div>Not implemented: {{nodeName}}</div>
</template>

<script>
    export default {
        name: "Unknown",
        props: ['nodeName', 'node'],
        mounted(){
            console.log(this.node);
            console.assert(false, this.nodeName);
        }
    }
</script>

<style scoped>

</style>
