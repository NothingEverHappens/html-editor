<template>
  <div class="wrapper" :class="{
      selected: node.selected,
      folded: node.folded,
      hasChildren: node.hasChildren
      }">


    <span v-if="node.tagName==='TEXT'">
      <span class="tag" :class="{selected: node.selected}"></span>
      {{node.textContent}}
    </span>

    <span v-if="node.tagName!=='TEXT'">
      <span class="element-wrapper">
        <span class="tag" v-if="node.tagName" :class="{selected: node.selected}">
          {{node.tagName}} <span v-if="node.id">#{{node.id}}</span>
        </span>
        <span v-for="attribute of node.attributes" :key="attribute.name" class="attribute">
          <span>{{attribute.name}}</span>
          <span>=</span>
          <span>{{attribute.value}}</span>
        </span>
      </span>
      <span v-if="!node.folded">
        <Node v-for="child of node.children" :key="child.key" :node="child"></Node>
      </span>
    </span>
  </div>
</template>

<script>
    export default {
        name: "Node",
        props: ['node'],
        data() {
            return {}
        },
    }
</script>

<style scoped>
  .folded.hasChildren:before {
    content: "+";
    position: absolute;
    margin-left: -10px;
    margin-top: 4px;
  }


  .element-wrapper {
    display: flex;
  }

  .wrapper {
    margin-left: 10px;
  }

  .wrapper.selected {
    background: #eee;
  }

  .tag.selected {
    background: #f90;
  }


  .attribute {
    padding: 4px;
  }

  .tag {
    background: #ddd;
    display: inline-block;
    padding: 4px;
    border-radius: 8px;
  }
</style>
