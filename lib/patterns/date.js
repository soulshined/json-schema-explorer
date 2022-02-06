// https://datatracker.ietf.org/doc/html/rfc3339#section-5.6
const DATE = "\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[01])";
const TIME = "\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?";

export default Object.seal({
    DATE: `^${DATE}$`,
    TIME: `^${TIME}$`,
    ISO_861: `^${DATE}[tT]${TIME}([zZ]|[\\+\\-]\\d{2}:\\d{2})$`
})