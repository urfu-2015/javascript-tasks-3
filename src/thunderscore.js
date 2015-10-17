export function filterIn(field, values, collection) {
    return collection.filter(item => Boolean(values.indexOf(item[field]) + 1));
}

export function filterEqual(field, value, collection) {
    return collection.filter(item => value === item[field]);
}

export function sortBy(field, order, collection) {
    return [...collection].sort((a, b) => {
        if (order === 'dsc') {
            [a, b] = [b, a];
        }
        if (a[field] > b[field]) {
            return 1;
        }
        if (a[field] < b[field]) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });
}

export function format(field, fieldMapper, collection) {
    return collection.map(item => ({
        ...item,
        [field]: fieldMapper(item[field])
    }));
}

export function select(fields, obj) {
    const computed = {};
    for (let field of fields) {
        computed[field] = obj[field];
    }
    return computed;
}
