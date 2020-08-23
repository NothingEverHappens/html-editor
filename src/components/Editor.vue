<template>
  <div>
    <Files></Files>
    <div style="display: flex; width: 100%">
      <div class="shortcuts" style="flex: 1;">
        <Shortcuts></Shortcuts>
      </div>
      <div class="editor" style="flex: 2">
        <HtmlEditor v-if="selectedFileType === fileTypes.HTML" :node="tree"></HtmlEditor>
        <TsEditor v-if="selectedFileType === fileTypes.TYPESCRIPT" :tree="tree"></TsEditor>
      </div>
    </div>
    <Preview></Preview>
  </div>

</template>

<script>
    import {mapGetters, mapMutations} from "vuex";
    import Shortcuts from "@/components/Shortcuts";
    import Preview from "@/components/Preview";
    import HtmlEditor from "@/components/editors/HtmlEditor";
    import Files from "@/components/Files";
    import {fileTypes} from "@/store/store";
    import TsEditor from "@/components/editors/ts/TsEditor";

    export default {
        name: "Editor",

        computed: {
            ...mapGetters(['tree', 'selectedFileType'])
        },
        methods: {
            ...mapMutations(['executeAction'])
        },

        components: {HtmlEditor, Files, Shortcuts, Preview, TsEditor},
        created() {
            this.fileTypes = fileTypes;
            // this.executeAction({type: 'goChild', tag: 'div'});
            // this.executeAction({type: 'goNext', tag: 'div'});
            // this.executeAction({type: 'goNext', tag: 'div'});
            // this.executeAction({type: 'goNext', tag: 'div'});
            // this.executeAction({type: 'goNext', tag: 'div'});
            // this.executeAction({type: 'goNext', tag: 'div'});
            // this.executeAction({type: 'jumpToProperty'});
            // this.executeAction({type: 'goChild', tag: 'div'});
            // this.executeAction({type: 'addDiv', tag: 'div'});
            // this.executeAction({type: 'addDiv', tag: 'div'});
            //  this.executeAction({type: 'addDiv', tag: 'div'});
            //  this.executeAction({type: 'addDiv', tag: 'div'});
            //  this.executeAction({type: 'addDiv', tag: 'div'});
            //  this.executeAction({type: 'addDiv', tag: 'div'});
            //  this.executeAction({type: 'addDiv', tag: 'div'});
            //  // this.executeAction({type: 'addChild', tag: 'span'});
            //  // this.executeAction({type: 'goChild'});
            //  this.executeAction({type: 'goNext'});
            //  // this.executeAction({type: 'goNext'});
            //  // this.executeAction({type: 'goNext'});
            // // this.executeAction({type: 'updateTagName', tagName: 'lol'});
            //  this.executeAction({type: 'moveDown'});
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
