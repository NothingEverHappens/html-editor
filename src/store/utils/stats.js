export class EditorStats {
    constructor(state, utils) {
        this.state = state;
        this.utils = utils;
        this.key = 'editor-usage-stats3';
        this.readData();

    }


    readData() {
        const data = JSON.parse(localStorage.getItem(this.key) || null);
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
        return this.data.tagNames.sort((a, b) => b.used - a.used);
    }

    useTagName(key) {
        const tag = this.data.tagNames.find(t => t.key === key);
        if (tag) {
            tag.used++;
        } else {
            this.data.tagNames.push({key: key, used: 1})
        }

        this.writeData();

    }
}
