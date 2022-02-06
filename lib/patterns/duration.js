// https://datatracker.ietf.org/doc/html/rfc3339#appendix-A
const SECOND = "\\d+\S";
const MINUTE = `\\d+\M(${SECOND})?`;
const HOUR = `\\d+\H(${MINUTE})?`;
const DAY = "\\d+\D";
const WEEK = "\\d+W";
const MONTH = `\\d+\M(${DAY})?`;
const YEAR = `\\d+\Y(${MONTH})?`;
const TIME = `T(${HOUR}|${MINUTE}|${SECOND})`;
const DATE = `(${DAY}|${MONTH}|${YEAR})(${TIME})?`;

export default Object.seal({
    DURATION: `^P(${DATE}|${TIME}|${WEEK})$`
});