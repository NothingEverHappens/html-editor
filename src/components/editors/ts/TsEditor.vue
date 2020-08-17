<template>
  <div class="wrapper ts-editor-wrapper">
    <TSNode :node="tree"/>
  </div>

</template>

<script>
    import TSNode from "@/components/editors/ts/components/TSNode";
    import {mapGetters} from "vuex";

    export default {
        name: "TsEditor",
        components: {TSNode},
        props: ['tree'],
        computed: {
            ...mapGetters('selectedFile')
        },
        data() {
            return {}
        },
        mounted() {

        }
    }
</script>

<style>
  .p20 {
    padding-left: 20px;
  }

  [data-node="PropertyAssignment"] > * > [data-node="StringLiteral"] {
    color: #006cff;
  }

  [data-node="Identifier"] {
    color: rgba(114, 114, 124, 0.86);
  }
  [data-node="StringLiteral"] {
    color: #076a4a;
  }


  .ts-editor-wrapper {
    font-family: Monaco;
  }
</style>
