// https://datatracker.ietf.org/doc/html/rfc6901

const unescaped = `[\\x00-\\x2E]|[\\x30-\\x7D|\\x7F-\u10FFFF]`;
const escaped = `~[01]`;
const reference_token = `(${unescaped}|${escaped})*`;
const json_pointer = `(\\/${reference_token})*`;

export default Object.seal({
    JSON_POINTER : `^${json_pointer}$`
});