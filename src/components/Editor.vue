<template>
  <div>
    <Files></Files>
    <HtmlEditor :node="tree"></HtmlEditor>
    <Shortcuts></Shortcuts>
    <Preview></Preview>
  </div>

</template>

<script>
    import {mapGetters, mapMutations} from "vuex";
    import Shortcuts from "@/components/Shortcuts";
    import Preview from "@/components/Preview";
    import HtmlEditor from "@/components/editors/HtmlEditor";
    import Files from "@/components/Files";

    export default {
        name: "Editor",

        computed: {
            ...mapGetters(['tree'])
        },
        methods: {
            ...mapMutations(['executeAction'])
        },
        components: {HtmlEditor, Files, Shortcuts, Preview,},
        created() {
            // this.executeAction({type: 'addDiv', tag: 'div'});
            // this.executeAction({type: 'addDiv', tag: 'div'});
            // this.executeAction({type: 'addDiv', tag: 'div'});
            this.executeAction({type: 'addDiv', tag: 'div'});
            this.executeAction({type: 'addDiv', tag: 'div'});
            this.executeAction({type: 'addDiv', tag: 'div'});
            this.executeAction({type: 'addDiv', tag: 'div'});
            this.executeAction({type: 'addDiv', tag: 'div'});
            // this.executeAction({type: 'addChild', tag: 'span'});
            // this.executeAction({type: 'goChild'});
            this.executeAction({type: 'goNext'});
            // this.executeAction({type: 'goNext'});
            // this.executeAction({type: 'goNext'});
           // this.executeAction({type: 'updateTagName', tagName: 'lol'});
            this.executeAction({type: 'moveDown'});
            // this.executeAction({type: 'addChild', tag: 'div'});
            // this.executeAction({type: 'addChild', tag: 'div'});
            // this.executeAction({type: 'addChild', tag: 'div'});
            // this.executeAction({type: 'goNext'});
            // this.executeAction({type: 'goNext'});
            //this.executeAction({type: 'updateTagName'});

            // this.setAttribute();
            // this.updateTagName('a');
        }
    }
</script>

<style scoped>

</style>
