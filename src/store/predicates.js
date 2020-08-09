export const predicates = {
    isRoot(utils) {
        return utils.isRoot()
    },
    isText(utils) {
        return utils.isText()
    },
    hasFilter(state) {
        return state.filter !== '';
    },
    not(predicate) {
        return (utils) => !predicate(utils);
    },
    and(predicate, predicate2) {
        return (utils) => predicate(utils) && predicate2(utils)
    },

};
