<template>
  <div>
    <div v-for="action of actions" :key="action.key" @click="trigger(action)">
      <span class="shortcut">{{action.displayShortcut}}</span>
      <span class="action">{{action.key}}</span>
    </div>
  </div>
</template>

<script>
    import {mapGetters, mapMutations} from "vuex";
    import {editorActions} from "@/store/actions";


    // TODO(kirjs): This shouldn't be a component
    export default {
        name: "Shortcuts",
        computed: {
            ...mapGetters(['tree', 'state']),
            actions() {
                return editorActions.getActions(this.state);
            }
        },
        methods: {
            ...mapMutations(['executeAction']),
            trigger(action) {
                this.executeAction({type: action.key})
            }
        },
        mounted() {
            this._keyListener = function (e) {
                const action = this.actions.find(a => {
                    if (typeof a.shortcut === 'string') {
                        return a.shortcut === e.key;
                    }
                    if (Array.isArray(a.shortcut)) {
                        return a.shortcut.includes(e.key);
                    }
                });

                if (action) {
                    this.trigger(action);
                } else {
                    console.log(e.key);
                }

            };

            document.addEventListener('keydown', this._keyListener.bind(this));
        },
        beforeDestroy() {
            document.removeEventListener('keydown', this._keyListener);
        }
    }
</script>

<style scoped>
  .shortcut {
    padding: 4px;
    background: aliceblue;
    width: 20px;
    border: 1px rgba(11, 152, 184, 0.38) solid;
    display: inline-block;
    margin-right: 4px;
    border-radius: 4px;
    text-align: center;
  }
</style>
