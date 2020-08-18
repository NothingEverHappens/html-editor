import {EditorAutocompleteOption, EditorState} from "@/store/types";
import {EditorUtils} from "@/store/utils/utils";

export class EditorStats {
    private readonly key = 'editor-usage-stats3';

    private data: Record<string, EditorAutocompleteOption[]> = {};

    constructor(private readonly state: EditorState, utils: EditorUtils) {
        this.readData();

    }


    readData() {
        const data = JSON.parse(localStorage.getItem(this.key) || 'null');
        if (!data) {
            this.data = {
                tagNames: []
            };
            this.writeData();
        } else {
            this.data = data;
        }
    }

    writeData() {
        localStorage.setItem(this.key, JSON.stringify(this.data));
    }

    getTagNames() {
        return this.getByKey('tagNames');
    }

    getByKey(dataSet: string, key?: string) {
        // TODO: Implement key
        return (this.data[dataSet] || []).sort((a, b) => b.used - a.used);
    }


    update(dataSet: string, key: string) {
        if (!this.data[dataSet]) {
            this.data[dataSet] = [];
        }

        const tag = this.data[dataSet].find(t => t.key === key);
        if (tag) {
            tag.used++;
        } else {
            this.data[dataSet].push({key, used: 1})
        }

        this.writeData();
    }

    useTagName(value: string) {
        this.update('tagNames', value);
    }
}
