<template>
  <div class="wrapper">
    <div v-for="file of files" :class="{selected: file.selected, file: true}" @click="selectFileName(file.name)"
         :key="file.name">{{file.name}}
    </div>
  </div>
</template>

<script>
    import {mapGetters, mapMutations} from "vuex";

    export default {
        name: "Files",
        computed: {
            ...mapGetters(['files'])
        },
        methods: {
            ...mapMutations(['selectFileName'])
        },
    }
</script>

<style scoped>
  .wrapper {
    display: flex;
  }

  .file {
    padding: 4px;
    cursor: pointer;
  }

  .selected {
    background: #ddd;
  }
</style>
