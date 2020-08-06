<template>
  <div>
    <div v-for="action of actions" :key="action.key" @click="trigger(action)">
      {{action.key}}
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
            ...mapGetters(['tree']),
            actions: () => editorActions.getActions()
        },
        methods: {
            ...mapMutations(['executeAction']),
            trigger(action) {
                this.executeAction({type: action.key})
            }
        },
        mounted() {
            this._keyListener = function (e) {
                const action = this.actions.find(a => a.shortcut === e.key);

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

</style>
