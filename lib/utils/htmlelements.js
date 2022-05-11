import { isDefined } from "./utils.js";

export default class HTMLElements {
    static tag = (tagName, innerHTML, tagClass, id) => {
        const el = document.createElement(tagName);
        if (innerHTML) el.innerHTML = innerHTML;
        if (tagClass) tagClass.split(" ").forEach(c => el.classList.add(c));
        if (id) el.id = id;
        return {
            node: el,
            append: (...tags) => {
                tags.forEach(tag => {
                    if (tag.node) el.appendChild(tag.node);
                    else el.appendChild(tag);
                })
                return el;
            }
        }
    }

    static span = (value, aClass) => {
        if (Array.isArray(aClass)) {
            aClass.map(c => c.toLowerCase());
        }
        else aClass = aClass.toLowerCase();

        return HTMLElements.tag('span', value, aClass).node;
    }
    static kvp = (key, value, valueType, id) => {
        if (!isDefined(value)) value = `null`;
        else if (value.constructor === Boolean) value = `${value}`;
        else if (value.constructor === String) value = `"${value}"`;
        else if (value.constructor === Array) value = `[${value.join(", ")}]`;

        if (value === `"null"`) valueType = 'null';

        return HTMLElements.tag('div', null, 'property', id).append(
            HTMLElements.span(key, 'key' + (key === 'const' ? ' const' : '')),
            HTMLElements.span(': ', 'separator'),
            HTMLElements.span(`${value}`, valueType)
        );
    }
    static details = (summary, count, id) => {
        const node = document.createElement('details');
        if (id) node.id = id;
        const sum = document.createElement('summary');
        sum.innerHTML = `<div>${summary}</div>`;
        if (count !== undefined) sum.querySelector('.property-datatype').innerHTML += `[${count}]`;
        node.appendChild(sum);
        return node;
    }
    static kvpdetails = (key, datatype, count, id) => {
        if (Array.isArray(datatype))
            datatype = datatype.join(" | ");

        return HTMLElements.details(`<span class="key">${key}</span> <span class="property-datatype">${datatype}</span> `, count, id);
    }
    static testButton = (property, value) => {
        const button = HTMLElements.tag('button', 'test', 'test').node;
        try {
            button.setAttribute('data-value', JSON.stringify(Object.assign({ property }, value)));
        } catch (error) {
            button.setAttribute('data-value', JSON.stringify({ property }));
        }
        return button;
    }

    static a = (href, value) => {
        const a = HTMLElements.tag('a', value).node;
        a.href = href;
        a.target = "_blank";
        return a;
    }
    static ul = (lis) => {
        return HTMLElements.tag('ul').append(
            ...lis.map(li => HTMLElements.tag('li', li))
        );
    }

}