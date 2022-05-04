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
    constructor(property, value, options) {
        this.datatype = isDefined(value) ? value.constructor : null;
        if (value === undefined) this.datatype = undefined;

        this.type = isDefined(this.datatype) ? value.constructor.name : `${this.datatype}`;
        this.key = property;
        this.value = value;
        this.children = [];
        this.options = options;

        if (isTypeOf(value, Object) && Object.keys(value).length === 1) {
            if (isDefined(value.enum)) this.type = 'Enum';
            else if (isDefined(value.const)) this.type = 'Const';
        }
    }

    static create(key, value, options) {
        if (!isDefined(value)) return new JsonNode(key, value, options);
        else if (value.constructor === Object) return new JsonObjectNode(key, value, options);
        else if (value.constructor === Array) return new JsonArrayNode(key, value, options);

        return new JsonNode(key, value, options);
    }

    get isDeprecated() {
        return this.key.toLowerCase().trim() === 'deprecated' && this.value === true;
    }

    get htmlNode() {
        return HTMLElements.kvp(this.key, this.value, this.type.toLowerCase());
    }

    includesType(type) {
        return (Array.isArray(this.type) && this.type.some(t => t.toLowerCase() === type.toLowerCase())) ||
            this.type.toLowerCase() === type.toLowerCase();
    }
}

class JsonObjectNode extends JsonNode {
    constructor(property, value, options) {
        super(property, value, options);

        if (isDefined(value) && isDefined(value.type)) {
            if (Array.isArray(value.type)) {
                this.type = value.type.map(m => {
                    if (m.trim().toLowerCase() === "null")
                        return m;

                    else return m.charAt(0).toUpperCase() + m.substring(1)
                }).join(" | ");
            }
            else this.type = value.type.charAt(0).toUpperCase() + value.type.substring(1);
        }

        if (value.constructor === Array)
            this.children.push(new JsonArrayNode(property, value, options));
        else {
            const entries = this.options.sortKeys === true
                ? Object.entries(value).sort(Sorter.keyAlphaAsc)
                : Object.entries(value);

            for (const [key, child] of entries)
                this.children.push(JsonNode.create(key, child, options));
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
        if (this.options.minifySimpleTypes === true && this.children.length === 1 && this.value.type !== undefined)
            node = HTMLElements.kvp(this.key, this.value.type, this.type.toLowerCase());

        else if (this.includesType('const'))
            node = HTMLElements.kvp('const', this.value.const, typeof this.value.const);

        else {
            node = HTMLElements.kvpdetails(this.key, this.type, count);
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
    constructor(property, value, options) {
        super(property, value, options);

        value.forEach(child => {
            if (child.constructor === Object) {
                const _options = Object.assign({}, options);
                _options.minifySimpleTypes = false;
                this.children.push(new JsonObjectNode('', child, _options));
            }
            else if (child.constructor === Array)
                this.children.push(new JsonArrayNode('', child, options));
            else this.children.push(child);
        });
    }

    get size() {
        return this.children.length;
    }

    get htmlNode() {
        const count = this.children.some(c => c instanceof JsonObjectNode) ? undefined : this.size;

        const node = HTMLElements.kvpdetails(this.key, this.type, count);
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
        const entries = this.options.sortKeys === true
            ? Object.entries(schema).sort(Sorter.keyAlphaAsc)
            : Object.entries(schema);

        for (const [key, value] of entries) {
            const li = document.createElement('li');
            const child = JsonNode.create(key, value, this.options);
            if (child.isDeprecated) root.classList.add('deprecated');
            li.appendChild(child.htmlNode);
            root.appendChild(li);
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

const cssStyle = document.createElement('style');
cssStyle.innerHTML = `${css.MODAL} ${css.EXPLORER}`;
document.querySelector('head').prepend(cssStyle);