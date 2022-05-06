const example1 = {
    description: `Demonstrates a schema with a format or regex pattern property applied. These properties include a built-in testable input for users to type in text for immediate feedback if their text meets the schema criteria`,
    schema: {
        '$id': 'http://com.foo.bar/schema.json',
        properties: {
            foo: {
                type: 'string',
                format: 'date-time',
                examples: [
                    '2012-02-20T00:00:00Z',
                    '2012-02-20T00:00:00.0000Z'
                ]
            }
        }
    }
};

const example2 = {
    description: `Demonstrates how the number of items are calculated. The count of the schema type reflects the count of properties, if it's an object with 'properties' key, or the length of the array, if the schema is an array with children (like in birthday)`,
    schema: {
        "type": "object",
        "properties": {
            "first_name": { "type": "string" },
            "last_name": { "type": "string" },
            "birthday": {
                "type": "string",
                "format": "date",
                "examples": [
                    '2022-01-01',
                    '1999-01-01'
                ]
            },
            "address": {
                "type": "object",
                "properties": {
                    "street_address": { "type": "string" },
                    "city": { "type": "string" },
                    "state": { "type": "string" },
                    "country": { "type": "string" }
                }
            }
        }
    }
};

const example3 = {
    description: `An array schema`,
    schema: {
        "type": "array",
        "additionalItems": false,
        "prefixItems": [
            { "type": "number" },
            { "type": "string" },
            { "enum": ["Street", "Avenue", "Boulevard"] },
            { "enum": ["NW", "NE", "SW", "SE"] },
            {
                "type": "array",
                "contains": {
                    "type": "number"
                },
                "minContains": 2,
                "uniqueItems": true
            },
            { const: "FooBar" },
            { type: "null" }
        ],
        "minItems": 5,
        "maxItems": 20
    }
};

const example4 = {
    id: `myJsonSchemaExplorer`,
    description: `This is a duplicate schema of example3, but with custom syntax highlighting. See the <a href="./main.css" target="_blank">example CSS file</a> to review selectors`,
    schema: example3.schema
};

const example5 = {
    description: `An example for a <a href="https://json-schema.org/understanding-json-schema/reference/string.html#index-12" target="_blank">regex string format</a>`,
    schema: {
        type: "object",
        properties: {
            regexp: {
                type: "string",
                format: "regex"
            }
        }
    }
};

const example6 = {
    description: `An example for a custom pattern (which is invalid in this case). Demonstrates an error in your schema for an improper capture group (not closed). Anytime your schema constraints produce an error, they are silently ignored, but will not produce a playground &lt;input&gt; element`,
    schema: {
        type: "object",
        properties: {
            pattern: {
                type: "string",
                pattern: "([a-zA-Z]"
            }
        }
    }
};

const example7 = {
    description: `Deprecated example`,
    schema: {
        type: "object",
        deprecated: true,
        properties: {
            pattern: {
                type: "string",
                pattern: "abc123"
            }
        }
    }
};

const example8 = {
    description: `Deprecated property example`,
    schema: {
        type: "object",
        properties: {
            pattern: {
                deprecated: true,
                type: "string",
                pattern: "abc123"
            }
        }
    }
};

const example9 = {
    description: `Demonstrates a schema with multiple types`,
    schema: {
        '$id': 'http://com.foo.bar/schema.json',
        type: "object",
        properties: {
            foo: {
                type: ['string', 'null'],
                maxLength: 50,
                pattern: "^w{3,}$"
            },
            bar: {
                type: ['array', "null"],
                minItems: 0
            }
        }
    }
};

const example10 = {
    description: `Demonstrates a schema with multiple types at top-level`,
    schema: {
        type: ["string", "null"],
        maxLength: 50,
        pattern: "^.*$"
    }
};

[
    example1,
    example2,
    example3,
    example4,
    example5,
    example6,
    example7,
    example8,
    example9,
    example10
].forEach((ex, i) => {
    document.body.innerHTML += `<h2>Example ${i + 1}</h2><p>${ex.description}</p>`;

    const explorer = document.createElement('json-schema-explorer');
    if (ex.id) explorer.id = ex.id;
    explorer.schema = ex.schema;
    document.body.appendChild(explorer);
})