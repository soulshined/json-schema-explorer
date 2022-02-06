// https://datatracker.ietf.org/doc/html/rfc3986#section-1
const HEX_DIGIT = "[0-9a-fA-F]";

const UNRESERVED = `[a-zA-Z0-9\\-\\.\\_\\~]`;
const PCT_ENCODED = `\\%${HEX_DIGIT}{2}`;
const SUB_DELIMS = `[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]`;
const GEN_DELIMS = `[:\\/\\?\\#\\[\]\\@]`;
const PCHAR = `(${UNRESERVED}|${PCT_ENCODED}|${SUB_DELIMS}|[:\\@])`;
const DEC_OCTET = `(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)`;
const H16 = '[a-fA-F\\d]{1,4}';

const IPV4 = `(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}`;
const IPV6 = `(?:(?:${H16}:){7}(?:${H16}|:)|(?:${H16}:){6}(?:${IPV4}|:${H16}|:)(?:${H16}:){5}(?::${IPV4}|(?::${H16}){1,2}|:)|(?:${H16}:){4}(?:(?::${H16}){0,1}:${IPV4}|(?::${H16}){1,3}|:)|(?:${H16}:){3}(?:(?::${H16}){0,2}:${IPV4}|(?::${H16}){1,4}|:)|(?:${H16}:){2}(?:(?::${H16}){0,3}:${IPV4}|(?::${H16}){1,5}|:)|(?:${H16}:){1}(?:(?::${H16}){0,4}:${IPV4}|(?::${H16}){1,6}|:)|(?::(?:(?::${H16}){0,5}:${IPV4}|(?::${H16}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?`;
const IPvFUTURE = `[vV]${HEX_DIGIT}+\\.(${UNRESERVED}|${SUB_DELIMS}|\\:)+`;
const IPLITERAL = `\\[(${IPV6}|${IPvFUTURE})\\]`;

const SEGMENT = `${PCHAR}*`;
const SEGMENT_NZ = `${PCHAR}+`;
const SEGMENT_NZ_NOCOLON = `(${UNRESERVED}|${PCT_ENCODED}|${SUB_DELIMS}|\\@)`;

const PATH_ABEMPTY = `(\\/${SEGMENT})*`;
const PATH_ABSOLUTE = `\\/(${SEGMENT_NZ}(\\/${SEGMENT})*)?`;
const PATH_NOSCHEME = `${SEGMENT_NZ_NOCOLON}(\\/${SEGMENT})*`;
const PATH_ROOTLESS = `${SEGMENT_NZ}(\\/${SEGMENT})*`;
const PATH_EMPTY = `.{0}`;
const PATH = `(${PATH_ABEMPTY}|${PATH_ABSOLUTE}|${PATH_NOSCHEME}|${PATH_ROOTLESS}|${PATH_EMPTY})`;

const SCHEME = `[A-Za-z][A-Za-z0-9\\+\\-\\.]*`;
const PORT = `\\d*`;
const REG_NAME = `(${UNRESERVED}|${PCT_ENCODED}|${SUB_DELIMS})*`;
const HOST = `(${IPLITERAL}|${IPV4}|${REG_NAME})`;
const USER_INFO = `(${UNRESERVED}|${PCT_ENCODED}|${SUB_DELIMS}|\\:)*`;
const AUTHORITY = `(${USER_INFO}\\@)?${HOST}(\\:${PORT})?`;
const HIER_PART = `(\\/\\/${AUTHORITY}${PATH_ABEMPTY}|${PATH_ABSOLUTE}|${PATH_ROOTLESS}|${PATH_EMPTY})`
const QUERY = `\\?(${PCHAR}|\\/|\\?)*`;
const FRAGMENT = `\\#(${PCHAR}|\\/|\\?)*`;
const URI = `${SCHEME}\\:${HIER_PART}(${QUERY})?(${FRAGMENT})?`;

const RELATIVE_PART = `\\/\\/${AUTHORITY}${PATH_ABEMPTY}|${PATH_ABSOLUTE}|${PATH_NOSCHEME}|${PATH_EMPTY}`;
const RELATIVE_REF = `${RELATIVE_PART}(${QUERY})?(${FRAGMENT})?`;
const URI_REF = `${URI}|${RELATIVE_REF}`;

export default Object.seal({
    IPV4: `^${IPV4}$`,
    IPV6: `^${IPV6}$`,
    IPvFUTURE : `^${IPvFUTURE}$`,
    IPLITERAL: `^${IPLITERAL}$`,
    URI: Object.seal({
        URI: `^${URI}$`,
        REF: `^${URI_REF}$`,
        SCHEME: `^${SCHEME}$`,
        PORT: `^${PORT}$`,
        HOST: `^${HOST}$`,
        PATH: `^${PATH}$`,
        RELATIVE_REF: `^${RELATIVE_REF}$`
    })
})