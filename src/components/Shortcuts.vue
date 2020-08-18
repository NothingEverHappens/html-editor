<template>
  <div>
    <input ref="filter" @keydown="handleFilter($event)" v-model="filter">
    <div v-for="action of actions" :key="action.key" @click="trigger(action)" class="action">
      <span class="shortcut">{{action.displayShortcut}}</span>
      <span>
        <span class="action">{{action.key}} </span>
        <span class="meta">{{action.meta}}</span>
      </span>
    </div>
  </div>
</template>

<script>
    import {mapGetters, mapMutations} from "vuex";
    import {editorActions} from "@/store/actions";
    import {mapFields} from 'vuex-map-fields';


    // TODO(kirjs): This shouldn't be a component
    export default {
        name: "Shortcuts",
        computed: {
            ...mapGetters(['tree', 'state', 'inputFocused']),
            actions() {
                const actions = editorActions.getActions(this.state, this.filter);
                return actions;
            },
            ...mapFields(['filter']),
        },

        watch: {
            inputFocused: {
                handler(focus) {
                    const input = this.$refs['filter'];
                    if (input) {
                        if (focus) {
                            window.setImmediate(() => input.focus())
                        } else {
                            input.blur();
                            this.filter = '';
                        }
                    }
                },
                immediate: true,
            }
        },
        methods: {
            ...mapMutations(['executeAction', 'updateFilter']),
            trigger(action) {
                this.executeAction({type: action.key})
            },
            handleFilter() {

            }
        },
        mounted() {
            this._keyListener = function (e) {
                const key = (e.metaKey ? '⌘' : '') + (e.ctrlKey ? '^' : '') + e.key;

                const action = this.actions.find(a => {

                    if (typeof a.shortcut === 'string') {
                        return a.shortcut === key;
                    }
                    if (Array.isArray(a.shortcut)) {
                        return a.shortcut.includes(key);
                    }

                    console.assert(false, 'Shortcut must be string ot array for action', a);
                });

                if (action) {
                    this.trigger(action);
                    e.preventDefault();
                } else {
                    //console.log(e.key);
                }

            };

            document.addEventListener('keydown', this._keyListener.bind(this));
        },
        beforeUnmount() {
            document.removeEventListener('keydown', this._keyListener);
        }
    };

</script>

<style scoped>
  input {
    border: 1px #ddd solid;
    font-size: 20px;
  }

  .action {
    cursor: pointer;
  }
  .meta {
    color: #999;
  }

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
