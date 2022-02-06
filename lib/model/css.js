export default Object.seal({
    MODAL: `json-schema-explorer-modal {
    display: flex;
    top: 0; left: 0;
    position: fixed;
    z-index: 1;
    width: 100%; height: 100%;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.4);
    font-family: Consolas, monospace;
}
json-schema-explorer-modal .modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 600px;
    overflow-y: auto;
    position: relative;
}
json-schema-explorer-modal .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
}
json-schema-explorer-modal .close:hover,
json-schema-explorer-modal .close:focus {
    color: #000;
}

json-schema-explorer-modal p {
    text-overflow: ellipsis;
    overflow: hidden;
}
json-schema-explorer-modal div.deprecated {
    position: absolute;
    top: 22px;
    padding: 0 3px;
    font-size: 10px;
    color: tomato;
    border: 1px solid tomato;
    border-radius: 5px;
}
json-schema-explorer-modal pre {
    overflow: auto;
}
json-schema-explorer-modal div.help {
    font-size: 11px;
    display: flex;
    width: 100%;
}
json-schema-explorer-modal div.help a:not(:first-child) {
    padding: 0 10px;
}
json-schema-explorer-modal details {
    font-size: 13px;
    margin: 8px 0;
}
json-schema-explorer-modal details summary {
    cursor: pointer;
}
json-schema-explorer-modal details summary > div {
    display: inline;
    user-select: none;
}
json-schema-explorer-modal details > ul {
    padding-left: 25px;
    margin: 0;
}
json-schema-explorer-modal form {
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: relative;
}
json-schema-explorer-modal form input {
    width: 100%;
}
json-schema-explorer-modal form input.valid,
json-schema-explorer-modal form input.invalid {
    border: 2px solid lightseagreen;
    border-radius: 3px;
    color: lightseagreen;
    outline: none;
    box-shadow: 0 0 2px 3px #20b2aa40;
}
json-schema-explorer-modal form input.invalid {
    border-color: tomato;
    color: tomato;
    box-shadow: 0 0 2px 3px #ff634740;
}
json-schema-explorer-modal form input + .result {
    position: absolute;
    right: 5px;
    user-select: none;
}
json-schema-explorer-modal form input.valid + .result::before {
    content: "✔";
    color: lightseagreen;
}
json-schema-explorer-modal form input.invalid + .result::before {
    content: "✖";
    color: tomato;
}`,
    EXPLORER: `json-schema-explorer {
    font-family: Consolas, monospace;
    font-size: 14px;
}
json-schema-explorer ul {
    list-style: none;
}
json-schema-explorer > ul {
    margin: 0; padding: 0;
}
json-schema-explorer > ul ul {
    padding-left: 20px;
}
json-schema-explorer summary {
    cursor: pointer;
}
json-schema-explorer summary > div {
    display: inline;
}
json-schema-explorer summary:hover {
    background-color: #f0fbff;
}
json-schema-explorer summary button.test {
    font-size: 11px;
    background-color: transparent;
    border: 1px solid #A2B7F6;
    border-radius: 3px;
    color: #A2B7F6;
    padding: 0 4px;
    cursor: pointer;
}
json-schema-explorer summary button.test:hover {
    color: #7C98F3;
    border-color: #7C98F3;
}
json-schema-explorer .property-datatype {
    color: #bbb;
    font-size: 13px;
}
json-schema-explorer .deprecated {
    text-decoration: line-through;
    text-decoration-color: lightgrey;
    opacity: .6;
}
json-schema-explorer .key {
    color: #a563b7;
}
json-schema-explorer .key.const,
json-schema-explorer .key.const + span {
    color: orange;
}
json-schema-explorer .\\#text,
json-schema-explorer .separator {
    color: rgba(0, 0, 0, 0.6);
}
json-schema-explorer .string {
    color: #31B72C;
}
json-schema-explorer .boolean {
    color: #56B5F0;
}
json-schema-explorer .number,
json-schema-explorer .integer {
    color: #D38B5D;
}
json-schema-explorer .null {
    color: #BC2C1A;
}`
})