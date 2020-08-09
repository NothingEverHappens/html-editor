<template>
  <div>{{html}}</div>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "Preview",
        computed: {
            ...mapGetters(['html'])
        },
    }
</script>

<style scoped>

</style>
