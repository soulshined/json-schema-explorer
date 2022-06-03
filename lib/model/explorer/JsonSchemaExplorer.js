import HTMLElements from '../../utils/htmlelements.js';
import { getPatternForFormat } from "../../utils/patterns.js";
import Sorter from "../../utils/sorter.js";
import { isDefined, isTypeOf } from "../../utils/utils.js";
import css from "../css.js";
import { Modal } from "../modal.js";
import JsonSchemaExplorerOptions from "./JsonSchemaExplorerOptions.js";

export {
    JsonSchemaExplorerOptions
};

class JsonNode {
    constructor(property, value, ownerId, options) {
        this.datatype = isDefined(value) ? value.constructor : null;
        if (value === undefined) this.datatype = undefined;

        this.type = isDefined(this.datatype) ? value.constructor.name : `${this.datatype}`;
        this.key = property;
        this.value = value;
        this.children = [];
        this.options = options;
        this.ownerId = ownerId;

        if (isTypeOf(value, Object) && Object.keys(value).length === 1) {
            if (isDefined(value.enum)) this.type = 'Enum';
            else if (isDefined(value.const)) this.type = 'Const';
        }
    }

    static create(key, value, ownerId, options) {
        if (!isDefined(value)) return new JsonNode(key, value, ownerId, options);
        else if (value.constructor === Object) return new JsonObjectNode(key, value, `${ownerId}-${key}`, options);
        else if (value.constructor === Array) return new JsonArrayNode(key, value, `${ownerId}-${key}`, options);

        return new JsonNode(key, value, ownerId, options);
    }

    get isDeprecated() {
        return this.key.toLowerCase().trim() === 'deprecated' && this.value === true;
    }

    get htmlNode() {
        return HTMLElements.kvp(this.key, this.value, this.type, `${this.ownerId}-${this.key}`);
    }

    includesType(type) {
        return (Array.isArray(this.type) && this.type.some(t => t.toLowerCase() === type.toLowerCase())) ||
            (!Array.isArray(this.type) && this.type.toLowerCase() === type.toLowerCase());
    }
}

class JsonObjectNode extends JsonNode {
    constructor(property, value, ownerId, options) {
        super(property, value, ownerId, options);

        if (isDefined(value) && isDefined(value.type)) {
            if (Array.isArray(value.type)) {
                this.type = value.type.map(m => {
                    if (m.trim().toLowerCase() === "null")
                        return m;

                    else return m.charAt(0).toUpperCase() + m.substring(1)
                });
            }
            else this.type = value.type.charAt(0).toUpperCase() + value.type.substring(1);
        }

        if (value.constructor === Array)
            this.children.push(new JsonArrayNode(property, value, ownerId, options));
        else {
            const entries = this.options.sortKeys === true
                ? Object.entries(value).sort(Sorter.keyAlphaAsc)
                : Object.entries(value);

            for (const [key, child] of entries)
                this.children.push(JsonNode.create(key, child, ownerId, options));
        }

        if (this.includesType('string') && this.datatype === Object && (this.value.pattern || this.value.format)) {
            if (this.value.format === undefined) this.isTestable = true;
            else this.isTestable = getPatternForFormat(this.value.format) !== undefined || this.value.format && this.value.format.toLowerCase().trim() === 'regex';
        }
    }

    get isDeprecated() {
        return this.datatype === Object && this.value.deprecated === true;
    }

    get size() {
        if (this.includesType('Object') && this.value.properties !== undefined)
            return Object.keys(this.value.properties).length;
        else if (this.includesType('Enum')) return this.value.enum.length;
        return Object.keys(this.value).length;
    }

    get htmlNode() {
        const count = !this.includesType('object') && !this.includesType('enum')
            ? undefined
            : this.size;

        let node;
        if (this.options.minifySimpleTypes === true && this.children.length === 1 && this.value.type !== undefined) {
            let thisType = this.type;
            let thisValue = this.value.type;
            if (Array.isArray(thisType))
                thisType = thisType.map(t => t.toLowerCase()).filter(t => t !== 'null')[0];
            if (Array.isArray(thisValue)) {
                thisValue = thisValue.map(v => {
                    v = v.toLowerCase();
                    if (v === "null") v = '"null"';
                    return v;
                })
            }

            node = HTMLElements.kvp(this.key, thisValue, thisType, this.ownerId);
        }

        else if (this.includesType('const'))
            node = HTMLElements.kvp('const', this.value.const, typeof this.value.const, this.ownerId);

        else {
            node = HTMLElements.kvpdetails(this.key, this.type, count, this.ownerId);
            if (this.isTestable) node.querySelector('summary > div').appendChild(HTMLElements.testButton(node.querySelector('summary .key').innerHTML, this.value));

            const ul = document.createElement('ul');
            if (this.includesType('Enum'))
                ul.innerHTML = this.children[0].htmlNode.querySelector('ul').innerHTML;
            else
                this.children
                    .forEach(child => ul.appendChild(HTMLElements.tag('li').append(child.htmlNode)));

            node.appendChild(ul);
        }

        if (this.isDeprecated) node.classList.add('deprecated');
        return node;
    }

}

class JsonArrayNode extends JsonNode {
    constructor(property, value, ownerId, options) {
        super(property, value, ownerId, options);

        value.forEach((child, index) => {
            if (child.constructor === Object) {
                const _options = Object.assign({}, options);
                _options.minifySimpleTypes = false;
                this.children.push(new JsonObjectNode('', child, `${ownerId}-${index}`, _options));
            }
            else if (child.constructor === Array) {
                this.children.push(new JsonArrayNode('', child, `${ownerId}-${index}`, options));
            }
            else this.children.push(child);
        });
    }

    get size() {
        return this.children.length;
    }

    get htmlNode() {
        const count = this.children.some(c => c instanceof JsonObjectNode) ? undefined : this.size;

        const node = HTMLElements.kvpdetails(this.key, this.type, count, this.ownerId);
        if (this.key === 'examples' && isTypeOf(this.value, Array)) {
            if ((isTypeOf(this.options.expand.examples, Boolean) && this.options.expand.examples === true) || (isTypeOf(this.options.expand.examples, Number) && this.size < this.options.expand.examples)) {
                node.open = true;
            }
        }
        const ul = document.createElement('ul');

        this.children.forEach(child => {
            const li = document.createElement('li');
            if (child instanceof JsonNode)
                li.appendChild(child.htmlNode);
            else li.innerHTML += `<span class="#text">${child}</span>`;
            ul.appendChild(li);
        })

        node.appendChild(ul);
        return node;
    }
}

export class JsonSchemaExplorer extends HTMLElement {
    constructor(schema, options = new JsonSchemaExplorerOptions()) {
        super();
        this.schema = schema;
        this._options = options || new JsonSchemaExplorerOptions();
    }

    get options() { return this._options || new JsonSchemaExplorerOptions(); }

    get schema() { return this._schema; }
    set schema(schema) {
        if (!isDefined(schema)) return;

        if (!isTypeOf(schema, Object))
            throw new Error(`Illegal argument type '${schema.constructor.name}' for root schema structure. Expecting Object`);

        this._schema = schema;

        const root = document.createElement('ul');
        const largestId = Math.max(0, ...[...document.querySelectorAll('json-schema-explorer > ul')]
            .map(i => i.id)
            .filter(f => f.startsWith('jse'))
            .map(m => +m.replace('jse', ''))
        );
        root.id = `jse${largestId + 1}`;
        const entries = this.options.sortKeys === true
            ? Object.entries(schema).sort(Sorter.keyAlphaAsc)
            : Object.entries(schema);

        for (const [key, value] of entries) {
            const li = document.createElement('li');
            const child = JsonNode.create(key, value, root.id, this.options);
            if (child.isDeprecated) root.classList.add('deprecated');
            li.appendChild(child.htmlNode);
            root.appendChild(li);
        }

        if (this._schema.type && [...this._schema.type].map(m => m.toLowerCase()).includes("string")) {
            if (this._schema.pattern || this._schema.format) {
                if (
                    (this.schema.pattern && this._schema.format === undefined) ||
                    `${this._schema.format}`.toLowerCase().trim() === 'regex' ||
                    (this._schema.format !== undefined && getPatternForFormat(this._schema.format) !== undefined)
                ) {
                    root.querySelector('summary > div').appendChild(HTMLElements.testButton('schema', this._schema));
                }
            }
        }

        if (this.options.expand.root === true) {
            [...root.children].forEach(child => {
                if (child.firstChild && child.firstChild.tagName === 'DETAILS')
                    child.firstChild.open = true;
            })
        }

        this.innerHTML = root.outerHTML;
    }
}
customElements.define('json-schema-explorer', JsonSchemaExplorer);

window.addEventListener('click', e => {
    if (e.target.closest('json-schema-explorer')) {
        if (e.target.tagName === 'BUTTON' && e.target.classList.contains('test')) {
            e.preventDefault();
            const modal = new Modal(e.target.getAttribute('data-value'));
            document.body.appendChild(modal);
            modal.focusInput();
        }
    }
})

window.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash) navigateToExplorerProperty(window.location.hash);
})

window.addEventListener('hashchange', () => {
    if (window.location.hash) navigateToExplorerProperty(window.location.hash);
})

function clamp(val, min, max) {
    if (val < min) return min;
    if (val > max) return max;
    return val;
}

const cssStyle = document.createElement('style');
cssStyle.innerHTML = `${css.MODAL} ${css.EXPLORER}`;
document.querySelector('head').prepend(cssStyle);

function navigateToExplorerProperty(elementId) {
    //navigate to explorer specific property and expand the details if a descendant of one
    if (elementId.startsWith('#')) elementId = elementId.substring(1);
    if (!elementId.startsWith("jse")) return;

    const explorer = document.getElementById(elementId.substring(0, clamp(elementId.indexOf("-"), 0, elementId.length)));
    const el = document.getElementById(elementId);
    if (!explorer || explorer === null || !el || el === null) return;
    if (explorer.parentElement.tagName !== 'JSON-SCHEMA-EXPLORER') return;

    let segments = elementId.split("-");
    do {
        segments.pop();
        const target = document.getElementById(segments.join("-"));
        if (target.tagName === 'DETAILS') target.open = true;
    } while (segments.length > 1);

    setTimeout(() => {
        el.scrollIntoView()
    }, 250);
}