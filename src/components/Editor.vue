<template>
  <div>lol
    <Node :node="tree"></Node>
    <Shortcuts></Shortcuts>
  </div>

</template>

<script>
    import Node from "@/components/Node";
    import {mapGetters, mapMutations} from "vuex";
    import Shortcuts from "@/components/Shortcuts";

    export default {
        name: "Editor",

        computed: {
            ...mapGetters(['tree'])
        },
        methods: {
            ...mapMutations(['addChild', 'goChild', 'goNext', 'setAttribute', 'updateTagName'])
        },
        components: {Node, Shortcuts,},
        created() {
            this.addChild({tag: 'div'});
            this.addChild({tag: 'span'});
            this.addChild({tag: 'span'});
            this.addChild({tag: 'span'});
            this.addChild({tag: 'span'});
            this.goChild();
            this.goNext();
            this.addChild({tag: 'div'});
            this.addChild({tag: 'div'});
            this.addChild({tag: 'div'});
            this.goNext();
            this.goNext();
            this.setAttribute();
            this.updateTagName('a');
        }
    }
</script>

<style scoped>

</style>
