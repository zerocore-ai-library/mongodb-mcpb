export function isObjectEmpty(value) {
    if (!value) {
        return true;
    }
    for (const prop in value) {
        if (Object.prototype.hasOwnProperty.call(value, prop)) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=isObjectEmpty.js.map