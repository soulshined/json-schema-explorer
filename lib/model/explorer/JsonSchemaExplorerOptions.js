export default class JsonSchemaExplorerOptions {
    constructor() {
        this._defaultExpand = {
            root: true,
            examples: false
        }
    }
    get minifySimpleTypes() { return this._minifySimpleTypes || true; }
    set minifySimpleTypes(val) { this._minifySimpleTypes = val; }
    get sortKeys() { return this._sortKeys || true; }
    set sortKeys(val) { this._sortKeys = val; }
    get expand() {
        const _expand = this._expand || this._defaultExpand;
        if (_expand.examples) {
            if (![true, false].includes(_expand.examples)) {
                if (_expand.examples.constructor === String && _expand.examples.startsWith('<')) {
                    if (Number.isSafeInteger(+_expand.examples.substring(1))) {
                        _expand.examples = Math.max(+_expand.examples.substring(1), 5)
                    }
                    else _expand.examples = this._defaultExpand.examples;
                }
                else _expand.examples = this._defaultExpand.examples;
            }
        }

        return _expand;
    }
    set expand(obj) { this._expand = Object.assign(this._defaultExpand, obj); }
}