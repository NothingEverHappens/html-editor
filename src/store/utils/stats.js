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
        return this.getByKey('tagNames');
    }

    getByKey(dataSet) {
        return (this.data[dataSet] || []).sort((a, b) => b.used - a.used);
    }


    update(dataSet, key) {
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

    useTagName(value) {
        this.update('tagNames', value);
    }
}
