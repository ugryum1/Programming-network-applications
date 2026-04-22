export function inverseConveyorStages(stages, keep) {
    if (!Array.isArray(stages)) {
        return [];
    }

    if (keep === undefined || keep === null) {
        return [...stages].reverse();
    }

    const length = stages.length;

    if (keep >= 0) {
        const fixed = stages.slice(0, Math.min(keep, length));
        const reversed = stages.slice(keep).reverse();
        return [...fixed, ...reversed];
    }

    const tailSize = Math.min(-keep, length);
    const head = stages.slice(0, length - tailSize).reverse();
    const tail = stages.slice(length - tailSize);
    return [...head, ...tail];
}
