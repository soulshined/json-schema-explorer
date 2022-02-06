export default class Sorter {
    static keyAlphaAsc() {
        const [key, value] = arguments;

        if (key[0].toLowerCase() > value[0].toLowerCase()) return 1;
        if (key[0].toLowerCase() < value[0].toLowerCase()) return -1;

        return 0;
    }
}