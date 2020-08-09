export const predicates = {
    isRoot(state, utils) {
        return utils.isRoot()
    },
    isText(state, utils) {
        return utils.isText()
    },
    hasFilter(state) {
        return state.filter !== '';
    },
    not(predicate) {
        return (state, utils) => !predicate(state, utils);
    },
    and(predicate, predicate2) {
        return (state, utils) => predicate(state, utils) && predicate2(state, utils)
    },

};
