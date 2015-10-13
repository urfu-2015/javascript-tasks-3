export function curry(fn, arity, ...args) {
    arity = arity === undefined ? fn.length : arity;
    if (arity - args.length > 0) {
        return (...extendedArgs) => curry(fn, arity, ...args, ...extendedArgs);
    } else {
        return fn(...args);
    }
}

export function pipe(resource, ...consumers) {
    return consumers.reduce((feed, consumer) => consumer(feed), resource);
}


