export function isOneOfTypes(val, constructors) {
    if (!isDefined(val))
        val = { constructor: null };
    return constructors.includes(val.constructor);
}

export const isTypeOf = (val, constructor) => isOneOfTypes(val, [constructor]);
export const isDefined = (value) => value !== undefined && value !== null;