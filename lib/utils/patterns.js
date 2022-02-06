import date from "../patterns/date.js";
import duration from "../patterns/duration.js";
import json from "../patterns/json.js";
import uri from "../patterns/uri.js";

const HEX_DIGIT = "[0-9a-fA-F]";
const UUID = `^${HEX_DIGIT}{8}-${HEX_DIGIT}{4}-${HEX_DIGIT}{4}-${HEX_DIGIT}{4}-${HEX_DIGIT}{12}$`;

export const SUPPORTED_FORMATS = {
    'date': {
        pattern: date.DATE,
        link: 'https://datatracker.ietf.org/doc/html/rfc3339#section-5.6'
    },
    'time': {
        pattern: date.TIME,
        link: 'https://datatracker.ietf.org/doc/html/rfc3339#section-5.6'
    },
    'date-time': {
        pattern: date.ISO_861,
        link: 'https://datatracker.ietf.org/doc/html/rfc3339#section-5.6'
    },
    'duration': {
        pattern: duration.DURATION,
        link: 'https://datatracker.ietf.org/doc/html/rfc3339#appendix-A'
    },
    'hostname': {
        pattern: uri.URI.HOST,
        link: 'https://datatracker.ietf.org/doc/html/rfc3986#section-1'
    },
    'ipv4' : {
        pattern: uri.IPV4,
        link: 'https://datatracker.ietf.org/doc/html/rfc3986#section-1'
    },
    'ipv6': {
        pattern: uri.IPV6,
        link: 'https://datatracker.ietf.org/doc/html/rfc3986#section-1'
    },
    'uuid': {
        pattern: UUID,
        link: 'https://datatracker.ietf.org/doc/html/rfc4122#section-3'
    },
    'uri': {
        pattern: uri.URI.URI,
        link: 'https://datatracker.ietf.org/doc/html/rfc3986#section-1'
    },
    'uri-reference': {
        pattern: uri.URI.REF,
        link: 'https://datatracker.ietf.org/doc/html/rfc3986#section-1'
    },
    'json-pointer' : {
        pattern: json.JSON_POINTER,
        link: 'https://datatracker.ietf.org/doc/html/rfc6901'
    }
};

export const getPatternForFormat = (format) => {
    return SUPPORTED_FORMATS[format.toLowerCase().trim()];
}

export default Object.seal({
    ...date,
    ...duration,
    UUID,
    ...json,
    IPV4: uri.IPV4,
    IPV6: uri.IPV6,
    IPvFUTURE: uri.IPvFUTURE,
    IPLITERAL: uri.IPLITERAL,
    ...uri.URI
});