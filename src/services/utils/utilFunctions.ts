const areObjectsDifferent = (a: Record<string, any>, b: Record<string, any>): boolean => {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of keys) {
        if (a[key] !== b[key]) return true;
    }
    return false;
};

export {
    areObjectsDifferent
}