import HTMLElements from "../utils/htmlelements.js";
import { getPatternForFormat } from "../utils/patterns.js";
import Sorter from "../utils/sorter.js";

export class Modal extends HTMLElement {
    constructor(json) {
        super();

        try {
            json = JSON.parse(json);
        } catch (error) { throw new Error(error); }

        const data = {
            maxLength: json.maxLength,
            minLength: json.minLength,
            pattern: json.pattern,
            format: json.format
        };

        const content = HTMLElements.tag('div', `<span class="close">&times;</span><p>${json.property}</p>`, 'modal-content')
            .append(
                HTMLElements.tag('pre').append(HTMLElements.tag('code')),
                HTMLElements.tag('div', null, 'help')
            );

        this.appendChild(content);

        if (json.deprecated)
            content.appendChild(HTMLElements.tag('div', 'deprecated', 'deprecated').node);

        content.querySelector('div.help').appendChild(
            HTMLElements.a("https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet", "Regex Help")
        );

        let isValidConstraints = true;
        let isRegexFormat = false;
        const form = document.createElement('form');
        const inputResult = HTMLElements.tag('span', null, 'result').node;
        const input = document.createElement('input');
        input.type = 'text';
        input.required = true;

        if (json.examples && json.examples.length > 0) {
            const details = HTMLElements.details('Examples');
            details.open = json.examples.length < 10;
            details.innerHTML += HTMLElements.ul(json.examples).outerHTML;
            details.style.maxHeight = '300px';
            details.style.overflow = 'auto';
            content.querySelector('pre').insertAdjacentElement('afterend', details);
        }

        if (data.minLength) input.minLength = data.minLength;
        if (data.maxLength) input.maxLength = data.maxLength;

        if (data.format && !data.pattern) {
            const supportedFormat = getPatternForFormat(data.format);
            if (supportedFormat) {
                data.pattern = supportedFormat.pattern;
                content.querySelector('div.help').appendChild(
                    HTMLElements.a(supportedFormat.link, `${data.format} definition`)
                );
            }
        }

        if (data.pattern) {
            try {
                input.pattern = new RegExp(data.pattern).source;
            } catch (error) { isValidConstraints = false; }
        }
        else if (data.format && data.format.toLowerCase().trim() === 'regex') isRegexFormat = true;

        content.querySelector('pre code').innerHTML = Object.entries(data)
                               .sort(Sorter.keyAlphaAsc)
                               .filter(f => f[1])
                               .map(([key, value]) => `${key}: ${value}`).join(",\n");
        form.append(input, inputResult);

        if (isValidConstraints) content.appendChild(form);

        form.addEventListener('submit', e => {
            e.preventDefault();
            return false;
        });

        input.addEventListener('keydown', () => {
            input.classList.remove('invalid');
            input.classList.remove('valid');
            input.setCustomValidity('');
        });
        input.addEventListener('keyup', e => {
            if (isRegexFormat) {
                try {
                    new RegExp(input.value);
                    input.classList.add('valid');
                } catch (error) {
                    input.classList.add('invalid');
                    input.setCustomValidity(error);
                    input.reportValidity();
                }

            }
            else if (e.target.reportValidity())
                input.classList.add('valid');
            else input.classList.add('invalid');
        })

        const keyupEscapeListener = ({ key }) => {
            if (key === 'Escape') {
                window.removeEventListener('keyup', keyupEscapeListener);
                this.remove();
            }
        }

        this.addEventListener('click', ({ target }) => {
            if (target.isSameNode(this)) {
                window.removeEventListener('keyup', keyupEscapeListener);
                this.remove();
            }
        })

        content.querySelector('span.close').addEventListener('click', () => {
            window.removeEventListener('keyup', keyupEscapeListener);
            this.remove()
        });

        window.addEventListener('keyup', keyupEscapeListener);
    }

    focusInput() {
        const input = this.querySelector('input');
        if (input) input.focus();
    }
}
customElements.define('json-schema-explorer-modal', Modal);
