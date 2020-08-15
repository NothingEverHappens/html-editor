function and(predicate, predicate2) {
    return (utils) => predicate(utils) && predicate2(utils)
}

function not(predicate) {
    return (utils) => !predicate(utils);
}

function isText(utils) {
    return utils.isText()
}

function isRoot(utils) {
    return utils.isRoot()
}

export const predicates = {
    isRoot,
    isText,
    hasFilter(state) {
        return state.filter !== '';
    },
    not,
    and,
    isMode(mode) {
        return (utils) => utils.mode.is(mode);
    },
    isNode: and(
        not(isText),
        not(isRoot),
    ),
};
