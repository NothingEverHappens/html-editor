import {fileTypes} from "@/store/store";


export const jsActions = [
    {
        key: 'createFunction',
        type: fileTypes.JAVASCRIPT,
        shortcut: 'f',
        handler() {
            console.log(1);
        }
    }
];
