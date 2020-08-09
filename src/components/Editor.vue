<template>
  <div>lol
    <Node :node="tree"></Node>
    <Shortcuts></Shortcuts>
    <Preview></Preview>
  </div>

</template>

<script>
    import Node from "@/components/Node";
    import {mapGetters, mapMutations} from "vuex";
    import Shortcuts from "@/components/Shortcuts";
    import Preview from "@/components/Preview";

    export default {
        name: "Editor",

        computed: {
            ...mapGetters(['tree'])
        },
        methods: {
            ...mapMutations(['executeAction'])
        },
        components: {Node, Shortcuts, Preview},
        created() {
            this.executeAction({type: 'addChild', tag: 'div'});
            this.executeAction({type: 'addChild', tag: 'div'});
            this.executeAction({type: 'addChild', tag: 'div'});
            this.executeAction({type: 'addChild', tag: 'div'});
            this.executeAction({type: 'addChild', tag: 'span'});
            this.executeAction({type: 'goChild'});
            this.executeAction({type: 'goNext'});
            this.executeAction({type: 'addChild', tag: 'div'});
            this.executeAction({type: 'addChild', tag: 'div'});
            this.executeAction({type: 'addChild', tag: 'div'});
            this.executeAction({type: 'goNext'});
            this.executeAction({type: 'goNext'});
            //this.executeAction({type: 'updateTagName'});

            // this.setAttribute();
            // this.updateTagName('a');
        }
    }
</script>

<style scoped>

</style>
