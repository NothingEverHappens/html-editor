import {kindMap} from "@/components/editors/ts/components/kindMap";

export const tsPredicates = {
    nodeKind(kinds) {
        kinds = [].concat(kinds);
        return (utils) => {
            const kind = kindMap[utils.ts.node.kind];
            return kinds.includes(kind)
        }
    }

};
